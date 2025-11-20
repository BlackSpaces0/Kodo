// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Log initialization
console.log('🦊 Zenko Financial initialized successfully');
console.log('📦 Firebase Project ID:', firebaseConfig.projectId || 'Not configured');

// Mount application to DOM
const appElement = document.getElementById('app');
if (appElement) {
  appElement.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f9fafb; font-family: system-ui, -apple-system, sans-serif;">
      <div style="text-align: center;">
        <div style="font-size: 6rem; margin-bottom: 1rem;">🦊</div>
        <h1 style="font-size: 2.5rem; font-weight: bold; color: #9333ea; margin-bottom: 0.5rem;">Zenko Financial</h1>
        <p style="font-size: 1.25rem; color: #4b5563;">Claridad Estratégica en tus Finanzas</p>
        <p style="font-size: 0.875rem; color: #6b7280; margin-top: 1rem;">Powered by Proyecto Kodō</p>
        <p style="font-size: 0.75rem; color: #9ca3af; margin-top: 2rem;">⚡ Vite + Firebase</p>
      </div>
    </div>
  `;
}
