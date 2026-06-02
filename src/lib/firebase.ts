import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXAbyjxEw4B7O_dVG9xBBSsM1683iphSA",
  authDomain: "testone-9129e.firebaseapp.com",
  projectId: "testone-9129e",
  storageBucket: "testone-9129e.firebasestorage.app",
  messagingSenderId: "618627512228",
  appId: "1:618627512228:web:21302a741a974b5858b331",
  measurementId: "G-PZHJN471Y5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
