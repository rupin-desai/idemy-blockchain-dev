const authMiddleware = require('./auth.middleware');
const validationMiddleware = require('./validation.middleware');
const uploadMiddleware = require('./upload.middleware');

module.exports = {
  auth: authMiddleware,
  validation: validationMiddleware,
  upload: uploadMiddleware
};