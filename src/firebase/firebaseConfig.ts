import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCAlvGBDEpOXc-_dI2gU7wPEhXjVJbMH-Y",
  authDomain: "taskmanager-a1e8a.firebaseapp.com",
  projectId: "taskmanager-a1e8a",
  storageBucket: "taskmanager-a1e8a.firebasestorage.app",
  messagingSenderId: "642776070281",
  appId: "1:642776070281:web:e9ba9c7ea3201db25d6e58",
  measurementId: "G-LBB5Q70G2J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-Out Error:", error);
  }
};

export { auth, signInWithGoogle, signOutUser };
