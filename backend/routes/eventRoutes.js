import express from 'express';
import {
  createEvent,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createEventSchema,
  updateEventSchema,
} from '../validations/eventValidation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', validate(createEventSchema), createEvent);
router.get('/', getMyEvents);
router.get('/:id', getEventById);
router.put('/:id', validate(updateEventSchema), updateEvent);
router.delete('/:id', deleteEvent);

export default router;

