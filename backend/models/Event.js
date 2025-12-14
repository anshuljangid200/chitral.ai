import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: 'Event date must be in the future',
      },
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
      minlength: [3, 'Venue must be at least 3 characters'],
      maxlength: [200, 'Venue cannot exceed 200 characters'],
    },
    ticketLimit: {
      type: Number,
      required: [true, 'Ticket limit is required'],
      min: [1, 'Ticket limit must be at least 1'],
      max: [100000, 'Ticket limit cannot exceed 100,000'],
    },
    approvalMode: {
      type: String,
      enum: ['auto', 'manual'],
      default: 'manual',
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
eventSchema.index({ organizer: 1, createdAt: -1 });
eventSchema.index({ date: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;

