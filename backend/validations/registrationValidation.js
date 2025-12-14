import Joi from 'joi';

export const registerSchema = Joi.object({
  userName: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 100 characters',
  }),
  userEmail: Joi.string().email().lowercase().trim().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
  }),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required().messages({
    'any.only': 'Status must be either "approved" or "rejected"',
    'any.required': 'Status is required',
  }),
});

