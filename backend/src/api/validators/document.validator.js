const Joi = require('joi');

// Document creation validation schema
const createDocumentSchema = Joi.object({
  did: Joi.string()
    .pattern(/^did:([a-z0-9]+):([a-zA-Z0-9.%-]+)(\/[^/]+)*$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid DID format',
      'any.required': 'DID is required'
    }),
  
  documentType: Joi.string()
    .valid('identification', 'certificate', 'diploma', 'license', 'medical', 'other')
    .required()
    .messages({
      'any.only': 'Document type must be one of: identification, certificate, diploma, license, medical, other',
      'any.required': 'Document type is required'
    }),
  
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Document name must be at least 3 characters long',
      'string.max': 'Document name must not exceed 100 characters',
      'any.required': 'Document name is required'
    }),
  
  description: Joi.string()
    .max(500)
    .allow('')
    .optional(),
  
  expiryDate: Joi.date()
    .iso()
    .greater('now')
    .allow(null)
    .optional()
    .messages({
      'date.format': 'Expiry date must be in ISO format (YYYY-MM-DD)',
      'date.greater': 'Expiry date must be in the future'
    })
});

// Document verification validation schema
const verifyDocumentSchema = Joi.object({
  documentId: Joi.string()
    .required()
    .messages({
      'any.required': 'Document ID is required'
    })
});

// Document update validation schema
const updateDocumentSchema = Joi.object({
  status: Joi.string()
    .valid('active', 'expired', 'revoked')
    .required()
    .messages({
      'any.only': 'Status must be one of: active, expired, revoked',
      'any.required': 'Status is required'
    })
});

module.exports = {
  createDocumentSchema,
  verifyDocumentSchema,
  updateDocumentSchema
};