import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';

// Public: Get event by ID for registration
export const getPublicEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).select('-__v');

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    });
  }

  // Check if event is expired
  if (new Date(event.date) < new Date()) {
    return res.status(400).json({
      success: false,
      message: 'This event has already passed',
    });
  }

  // Get approved registrations count
  const approvedCount = await Registration.countDocuments({
    event: event._id,
    status: 'approved',
  });

  const availableTickets = event.ticketLimit - approvedCount;

  res.json({
    success: true,
    data: {
      event: {
        ...event.toObject(),
        availableTickets: Math.max(0, availableTickets),
        isSoldOut: availableTickets <= 0,
      },
    },
  });
});

// Public: Register for an event
export const registerForEvent = asyncHandler(async (req, res) => {
  const { userName, userEmail } = req.body;
  const eventId = req.params.id;

  // Validate event exists
  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    });
  }

  // Check if event is expired
  if (new Date(event.date) < new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot register for an event that has already passed',
    });
  }

  // Use transaction to prevent race conditions
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check current approved count within transaction
    const approvedCount = await Registration.countDocuments({
      event: eventId,
      status: 'approved',
    }).session(session);

    if (approvedCount >= event.ticketLimit) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Event is sold out',
      });
    }

    // Check for duplicate registration
    const existingRegistration = await Registration.findOne({
      event: eventId,
      userEmail: userEmail.toLowerCase(),
    }).session(session);

    if (existingRegistration) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event',
      });
    }

    // Determine status based on approval mode
    const status = event.approvalMode === 'auto' ? 'approved' : 'pending';

    // Create registration
    const registration = await Registration.create(
      [
        {
          event: eventId,
          userName,
          userEmail: userEmail.toLowerCase(),
          status,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message:
        status === 'approved'
          ? 'Registration successful! Your ticket has been approved.'
          : 'Registration successful! Your request is pending approval.',
      data: {
        registration: {
          id: registration[0]._id,
          ticketId: registration[0].ticketId,
          status: registration[0].status,
          event: registration[0].event,
        },
      },
    });
  } catch (error) {
    await session.abortTransaction();

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event',
      });
    }

    throw error;
  } finally {
    session.endSession();
  }
});

// Get ticket by ticket ID
export const getTicket = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;

  const registration = await Registration.findOne({ ticketId })
    .populate('event', 'title description date venue')
    .select('-__v');

  if (!registration) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found',
    });
  }

  // Only show ticket if approved
  if (registration.status !== 'approved') {
    return res.status(403).json({
      success: false,
      message: 'Ticket is not approved yet',
    });
  }

  res.json({
    success: true,
    data: { ticket: registration },
  });
});

// Get all registrations for an event (organizer only)
export const getEventRegistrations = asyncHandler(async (req, res) => {
  const eventId = req.params.id;

  // Verify event exists and belongs to organizer
  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    });
  }

  if (event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view registrations for this event',
    });
  }

  const registrations = await Registration.find({ event: eventId })
    .sort({ createdAt: -1 })
    .select('-__v');

  // Get counts
  const pendingCount = await Registration.countDocuments({
    event: eventId,
    status: 'pending',
  });
  const approvedCount = await Registration.countDocuments({
    event: eventId,
    status: 'approved',
  });
  const rejectedCount = await Registration.countDocuments({
    event: eventId,
    status: 'rejected',
  });

  res.json({
    success: true,
    count: registrations.length,
    data: {
      registrations,
      stats: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        total: registrations.length,
      },
    },
  });
});

// Update registration status (approve/reject)
export const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const { registrationId } = req.params;
  const { status } = req.body;

  const registration = await Registration.findById(registrationId).populate('event');

  if (!registration) {
    return res.status(404).json({
      success: false,
      message: 'Registration not found',
    });
  }

  // Verify event belongs to organizer
  if (registration.event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this registration',
    });
  }

  // If approving, check ticket limit
  if (status === 'approved') {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const approvedCount = await Registration.countDocuments({
        event: registration.event._id,
        status: 'approved',
      }).session(session);

      if (approvedCount >= registration.event.ticketLimit) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: 'Cannot approve. Event ticket limit reached',
        });
      }

      registration.status = 'approved';
      await registration.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } else {
    registration.status = status;
    await registration.save();
  }

  res.json({
    success: true,
    message: `Registration ${status} successfully`,
    data: { registration },
  });
});

