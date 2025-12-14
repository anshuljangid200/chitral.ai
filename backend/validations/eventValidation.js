import Joi from 'joi';

export const createEventSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required().messages({
    'string.empty': 'Event title is required',
    'string.min': 'Title must be at least 3 characters',
    'string.max': 'Title cannot exceed 200 characters',
  }),
  description: Joi.string().trim().min(10).max(5000).required().messages({
    'string.empty': 'Event description is required',
    'string.min': 'Description must be at least 10 characters',
    'string.max': 'Description cannot exceed 5000 characters',
  }),
  date: Joi.date().greater('now').required().messages({
    'date.base': 'Event date is required',
    'date.greater': 'Event date must be in the future',
  }),
  venue: Joi.string().trim().min(3).max(200).required().messages({
    'string.empty': 'Venue is required',
    'string.min': 'Venue must be at least 3 characters',
    'string.max': 'Venue cannot exceed 200 characters',
  }),
  ticketLimit: Joi.number().integer().min(1).max(100000).required().messages({
    'number.base': 'Ticket limit is required',
    'number.min': 'Ticket limit must be at least 1',
    'number.max': 'Ticket limit cannot exceed 100,000',
  }),
  approvalMode: Joi.string().valid('auto', 'manual').default('manual').messages({
    'any.only': 'Approval mode must be either "auto" or "manual"',
  }),
});

export const updateEventSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200),
  description: Joi.string().trim().min(10).max(5000),
  date: Joi.date().greater('now'),
  venue: Joi.string().trim().min(3).max(200),
  ticketLimit: Joi.number().integer().min(1).max(100000),
  approvalMode: Joi.string().valid('auto', 'manual'),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

