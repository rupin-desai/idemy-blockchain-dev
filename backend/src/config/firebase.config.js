const dotenv = require("dotenv");
dotenv.config();

const admin = require('firebase-admin');

// Export a function that initializes Firebase
const initializeFirebase = () => {
  if (admin.apps.length) {
    return admin; // Return existing instance if already initialized
  }

  try {
    // Process the private key to handle newlines correctly
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    const firebaseConfig = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID || '',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL || ''
    };

    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    return admin;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
};

// Export the initialization function
module.exports = initializeFirebase;
