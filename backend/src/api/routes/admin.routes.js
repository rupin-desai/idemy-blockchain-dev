const express = require("express");
const router = express.Router();
const firebaseService = require("../../services/firebase.service");
const admin = require("firebase-admin");

// Development only routes
if (process.env.NODE_ENV === "development") {
  router.post("/create-admin", async (req, res) => {
    try {
      console.log("Creating development admin user");

      const adminUser = {
        email: "admin@university.edu",
        password: "Admin@123",
        displayName: "System Administrator",
        role: "admin",
      };

      // Check if user already exists
      let userRecord;
      try {
        userRecord = await firebaseService.auth.getUserByEmail(adminUser.email);
        console.log("Admin user already exists, updating role...");
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          // Create the user
          userRecord = await firebaseService.auth.createUser({
            email: adminUser.email,
            password: adminUser.password,
            displayName: adminUser.displayName,
          });
          console.log("Admin user created in Firebase Auth");
        } else {
          throw error;
        }
      }

      // Set admin role in custom claims
      await firebaseService.auth.setCustomUserClaims(userRecord.uid, {
        role: "admin",
      });
      console.log("Set admin custom claims");

      // Create or update user in Firestore
      await firebaseService.db.collection("users").doc(userRecord.uid).set(
        {
          uid: userRecord.uid,
          email: adminUser.email,
          displayName: adminUser.displayName,
          role: adminUser.role,
          isActive: true,
          profileCompleted: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      console.log("User data stored in Firestore");

      res.status(200).json({
        success: true,
        message: "Admin user created successfully",
        credentials: {
          email: adminUser.email,
          password: adminUser.password,
        },
      });
    } catch (error) {
      console.error("Error creating admin:", error);
      res.status(500).json({
        success: false,
        message: `Failed to create admin: ${error.message}`,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  });
}

module.exports = router;
