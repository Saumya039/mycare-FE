
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

try {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
} catch (error) {
  console.log('Already initialized');
}

async function seedUser() {
  try {
    const userRecord = await getAuth().createUser({
      uid: 'superadmin',
      email: 'superadmin@sevraai.com',
      emailVerified: true,
      password: 'password123',
      displayName: 'Super Admin',
      disabled: false,
    });
    console.log('Successfully created new user:', userRecord.uid);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('User already exists in Firebase Auth.');
      // Optionally update the password to ensure it's correct
      await getAuth().updateUserByEmail('superadmin@sevraai.com', {
        password: 'password123'
      });
      console.log('Updated password to password123');
    } else {
      console.error('Error creating new user:', error);
    }
  }
}

seedUser();
