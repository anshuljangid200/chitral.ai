import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

// Create a custom alphabet for human-readable ticket IDs
const generateTicketId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    userName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    userEmail: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    ticketId: {
      type: String,
      unique: true,
      default: () => generateTicketId(),
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate registrations
registrationSchema.index({ event: 1, userEmail: 1 }, { unique: true });

// Index for efficient queries
registrationSchema.index({ event: 1, status: 1 });
// ticketId already has unique: true which creates an index, no need for separate index

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;

