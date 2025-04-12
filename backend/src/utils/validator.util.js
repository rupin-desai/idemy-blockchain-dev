const Joi = require("joi");

/**
 * Validate an email address
 * @param {String} email - Email to validate
 */
const validateEmail = (email) => {
  const schema = Joi.string().email().required();
  const { error } = schema.validate(email);
  return { isValid: !error, error: error?.message };
};

/**
 * Validate a password
 * @param {String} password - Password to validate
 */
const validatePassword = (password) => {
  const schema = Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one letter and one number",
    });

  const { error } = schema.validate(password);
  return { isValid: !error, error: error?.message };
};

/**
 * Validate a phone number
 * @param {String} phone - Phone number to validate
 */
const validatePhone = (phone) => {
  const schema = Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid international format",
    });

  const { error } = schema.validate(phone);
  return { isValid: !error, error: error?.message };
};

/**
 * Validate a wallet address
 * @param {String} address - Wallet address to validate
 */
const validateWalletAddress = (address) => {
  const schema = Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required()
    .messages({
      "string.pattern.base": "Wallet address must be a valid Ethereum address",
    });

  const { error } = schema.validate(address);
  return { isValid: !error, error: error?.message };
};

/**
 * Validate personal information
 * @param {Object} personalInfo - Personal information to validate
 */
const validatePersonalInfo = (personalInfo) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    middleName: Joi.string().allow("").optional(),
    dateOfBirth: Joi.date().iso().required(),
    gender: Joi.string()
      .valid("Male", "Female", "Other", "Prefer not to say")
      .required(),
    nationality: Joi.string().required(),
    placeOfBirth: Joi.string().required(),
  });

  const { error } = schema.validate(personalInfo);
  return { isValid: !error, error: error?.details?.[0]?.message };
};

/**
 * Validate address information
 * @param {Object} address - Address to validate
 */
const validateAddress = (address) => {
  const schema = Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  });

  const { error } = schema.validate(address);
  return { isValid: !error, error: error?.details?.[0]?.message };
};

/**
 * Validate contact information
 * @param {Object} contactInfo - Contact info to validate
 */
const validateContactInfo = (contactInfo) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required(),
  });

  const { error } = schema.validate(contactInfo);
  return { isValid: !error, error: error?.details?.[0]?.message };
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateWalletAddress,
  validatePersonalInfo,
  validateAddress,
  validateContactInfo,
};
