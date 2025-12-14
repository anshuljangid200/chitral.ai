import express from 'express';
import {
  getPublicEvent,
  registerForEvent,
  getTicket,
  getEventRegistrations,
  updateRegistrationStatus,
} from '../controllers/registrationController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  registerSchema,
  updateStatusSchema,
} from '../validations/registrationValidation.js';

const router = express.Router();

// Public routes
router.get('/public/event/:id', getPublicEvent);
router.post('/public/event/:id/register', validate(registerSchema), registerForEvent);
router.get('/ticket/:ticketId', getTicket);

// Protected routes (organizer only)
router.get('/event/:id', authenticate, getEventRegistrations);
router.put('/:registrationId/status', authenticate, validate(updateStatusSchema), updateRegistrationStatus);

export default router;

