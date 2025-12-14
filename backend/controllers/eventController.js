import Event from '../models/Event.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, venue, ticketLimit, approvalMode } = req.body;

  const event = await Event.create({
    title,
    description,
    date,
    venue,
    ticketLimit,
    approvalMode: approvalMode || 'manual',
    organizer: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: { event },
  });
});

export const getMyEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id })
    .sort({ createdAt: -1 })
    .select('-__v');

  res.json({
    success: true,
    count: events.length,
    data: { events },
  });
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).select('-__v');

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    });
  }

  res.json({
    success: true,
    data: { event },
  });
});

export const updateEvent = asyncHandler(async (req, res) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    });
  }

  // Check ownership
  if (event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this event',
    });
  }

  // Prevent updating past events
  if (new Date(event.date) < new Date() && req.body.date) {
    return res.status(400).json({
      success: false,
      message: 'Cannot update date of past events',
    });
  }

  event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).select('-__v');

  res.json({
    success: true,
    message: 'Event updated successfully',
    data: { event },
  });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    });
  }

  // Check ownership
  if (event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this event',
    });
  }

  await Event.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Event deleted successfully',
  });
});

