const admin = require("firebase-admin");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Firebase with credentials from .env
function initializeFirebase() {
  // Create service account object from environment variables
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: "", // Not provided in .env but not required
    auth_uri: "https://accounts.google.com/o/oauth2/auth", // Standard value
    token_uri: "https://oauth2.googleapis.com/token", // Standard value
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs", // Standard value
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`, // Generate from client email
  };

  // Initialize the app
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

// Admin user details
const adminUser = {
  email: "admin@university.edu",
  password: "Admin@123",
  displayName: "System Administrator",
  role: "admin",
};

async function createAdminUser() {
  try {
    console.log(
      "Initializing Firebase Admin SDK with environment variables..."
    );
    initializeFirebase();

    console.log(`Creating admin user: ${adminUser.email}`);

    // Check if user already exists
    try {
      const existingUser = await admin.auth().getUserByEmail(adminUser.email);
      console.log(
        "User already exists with this email, updating to admin role..."
      );

      // Set admin custom claims
      await admin
        .auth()
        .setCustomUserClaims(existingUser.uid, { role: adminUser.role });

      // Update or create user in Firestore
      await admin.firestore().collection("users").doc(existingUser.uid).set(
        {
          uid: existingUser.uid,
          email: adminUser.email,
          displayName: adminUser.displayName,
          role: adminUser.role,
          isActive: true,
          profileCompleted: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      console.log(`User ${adminUser.email} has been updated to admin role.`);
      console.log("You can now login with the following credentials:");
      console.log(`Email: ${adminUser.email}`);
      console.log(`Password: (existing password)`);

      process.exit(0);
    } catch (error) {
      // Continue to create new user if not found
      if (error.code !== "auth/user-not-found") {
        console.error("Error checking existing user:", error);
        console.log("Attempting to create new user instead...");
      }
    }

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: adminUser.email,
      password: adminUser.password,
      displayName: adminUser.displayName,
    });

    console.log("User created successfully in Firebase Auth");

    // Set admin custom claims
    await admin
      .auth()
      .setCustomUserClaims(userRecord.uid, { role: adminUser.role });

    // Store user in Firestore
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: adminUser.email,
      displayName: adminUser.displayName,
      role: adminUser.role,
      isActive: true,
      profileCompleted: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("User data stored in Firestore");
    console.log(
      `Successfully created admin user with email: ${adminUser.email}`
    );
    console.log("You can now login with the following credentials:");
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminUser.password}`);

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();
