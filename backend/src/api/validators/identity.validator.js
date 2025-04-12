const Joi = require("joi");

// Personal info validation schema
const personalInfoSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  middleName: Joi.string().allow("").optional(),
  dateOfBirth: Joi.date().iso().less("now").required().messages({
    "date.less": "Date of birth must be in the past",
  }),
  gender: Joi.string()
    .valid("Male", "Female", "Other", "Prefer not to say")
    .required(),
  nationality: Joi.string().required(),
  placeOfBirth: Joi.string().required(),
});

// Address validation schema
const addressSchema = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postalCode: Joi.string().required(),
  country: Joi.string().required(),
});

// Contact info validation schema
const contactInfoSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required(),
});

// Create identity validation schema
const createIdentitySchema = Joi.object({
  personalInfo: personalInfoSchema.required(),
  address: addressSchema.required(),
  contactInfo: contactInfoSchema.required(),
  walletAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .optional()
    .messages({
      "string.pattern.base": "Wallet address must be a valid Ethereum address",
    }),
});

// Update identity validation schema
const updateIdentitySchema = Joi.object({
  address: addressSchema.optional(),
  contactInfo: contactInfoSchema.optional(),
});

// Verify identity validation schema
const verifyIdentitySchema = Joi.object({
  status: Joi.string()
    .valid("pending", "verified", "rejected", "revoked")
    .required()
    .messages({
      "any.only": "Status must be one of: pending, verified, rejected, revoked",
      "any.required": "Status is required",
    }),
  notes: Joi.string().max(500).optional(),
});

module.exports = {
  createIdentitySchema,
  updateIdentitySchema,
  verifyIdentitySchema,
  personalInfoSchema,
  addressSchema,
  contactInfoSchema,
};
