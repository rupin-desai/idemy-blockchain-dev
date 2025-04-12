const cryptoUtil = require('./crypto.util');
const didUtil = require('./did.util');
const validatorUtil = require('./validator.util');
const logger = require('./logger.util');
const { AppError, catchAsync, globalErrorHandler } = require('./error-handler.util');

module.exports = {
  crypto: cryptoUtil,
  did: didUtil,
  validator: validatorUtil,
  logger,
  AppError,
  catchAsync,
  globalErrorHandler
};