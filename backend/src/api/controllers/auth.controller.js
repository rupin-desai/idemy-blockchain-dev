const authService = require("../../services/auth.service");
const validator = require("../../utils/validator.util");
const { catchAsync } = require("../../utils/error-handler.util");

/**
 * Register a new user
 */
exports.register = catchAsync(async (req, res) => {
  const { email, password, displayName, phoneNumber } = req.body;

  // Validate inputs
  const emailValidation = validator.validateEmail(email);
  if (!emailValidation.isValid) {
    return res
      .status(400)
      .json({ success: false, message: emailValidation.error });
  }

  const passwordValidation = validator.validatePassword(password);
  if (!passwordValidation.isValid) {
    return res
      .status(400)
      .json({ success: false, message: passwordValidation.error });
  }

  // Register user
  const result = await authService.register({
    email,
    password,
    displayName,
    phoneNumber,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

/**
 * Login user
 */
exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  const emailValidation = validator.validateEmail(email);
  if (!emailValidation.isValid) {
    return res
      .status(400)
      .json({ success: false, message: emailValidation.error });
  }

  // Login (password is validated by Firebase)
  const result = await authService.login(email, password);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

/**
 * Get user profile
 */
exports.getProfile = catchAsync(async (req, res) => {
  const { uid } = req.user;

  const profile = await authService.getProfile(uid);

  res.status(200).json({
    success: true,
    data: profile,
  });
});

/**
 * Update user profile
 */
exports.updateProfile = catchAsync(async (req, res) => {
  const { uid } = req.user;
  const { displayName, phoneNumber } = req.body;

  const updatedProfile = await authService.updateProfile(uid, {
    displayName,
    phoneNumber,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedProfile,
  });
});

/**
 * Reset password
 */
exports.resetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  // Validate email
  const emailValidation = validator.validateEmail(email);
  if (!emailValidation.isValid) {
    return res
      .status(400)
      .json({ success: false, message: emailValidation.error });
  }

  await authService.resetPassword(email);

  res.status(200).json({
    success: true,
    message: "Password reset email sent",
  });
});

/**
 * Create a development admin account (development only)
 */
exports.createDevAdmin = catchAsync(async (req, res) => {
  // Only allow in development environment
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({
      success: false,
      message: "This endpoint is only available in development environment",
    });
  }

  const admin = {
    email: "admin@university.edu",
    password: "Admin@123",
    displayName: "System Administrator",
    role: "admin",
  };

  try {
    // Try to get existing user first
    let userRecord;

    try {
      userRecord = await req.app.locals.firebase.auth.getUserByEmail(
        admin.email
      );
      console.log("Admin user already exists, updating role...");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // Create the user if not found
        userRecord = await req.app.locals.firebase.createUser({
          email: admin.email,
          password: admin.password,
          displayName: admin.displayName,
        });
        console.log("Admin user created successfully");
      } else {
        throw error;
      }
    }

    // Set admin custom claims
    await req.app.locals.firebase.auth.setCustomUserClaims(userRecord.uid, {
      role: admin.role,
    });

    // Update or create user in Firestore
    await req.app.locals.firebase.db
      .collection("users")
      .doc(userRecord.uid)
      .set(
        {
          uid: userRecord.uid,
          email: admin.email,
          displayName: admin.displayName,
          role: admin.role,
          isActive: true,
          profileCompleted: true,
          createdAt:
            req.app.locals.firebase.admin.firestore.FieldValue.serverTimestamp(),
          updatedAt:
            req.app.locals.firebase.admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    res.status(200).json({
      success: true,
      message: "Admin user created/updated successfully",
      data: {
        email: admin.email,
        password: "Admin@123", // Only show in development!
      },
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    res.status(500).json({
      success: false,
      message: `Failed to create admin: ${error.message}`,
    });
  }
});
