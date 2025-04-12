const multer = require('multer');
const { AppError } = require('../../utils/error-handler.util');

// Multer storage
const storage = multer.memoryStorage();

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  // Accept images, PDFs, and documents
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new AppError('Not a supported file type. Please upload an image, PDF, or document.', 400), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter,
});

// Single file upload middleware
exports.uploadSingle = (fieldName) => upload.single(fieldName);

// Multiple file upload middleware
exports.uploadMultiple = (fieldName, maxCount) => upload.array(fieldName, maxCount);

// Process uploaded file
exports.processUploadedFile = (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', 400));
  }
  
  // Add file metadata to request
  req.fileMetadata = {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    buffer: req.file.buffer,
  };
  
  next();
};