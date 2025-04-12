const Joi = require('joi');

// Registration validation schema
const registerSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one letter and one number',
      'any.required': 'Password is required'
    }),
  
  displayName: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.min': 'Display name must be at least 3 characters long',
      'string.max': 'Display name must not exceed 50 characters',
      'any.required': 'Display name is required'
    }),
  
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .allow('')
    .optional()
    .messages({
      'string.pattern.base': 'Phone number must be a valid international format'
    })
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Password reset validation schema
const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    })
});

// Profile update validation schema
const updateProfileSchema = Joi.object({
  displayName: Joi.string()
    .min(3)
    .max(50)
    .optional(),
  
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .allow('')
    .optional()
    .messages({
      'string.pattern.base': 'Phone number must be a valid international format'
    })
});

module.exports = {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  updateProfileSchema
};