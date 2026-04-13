import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAVfksvfxlyPkgYxQsebjM0BsB2Ddy9Aok",
  authDomain: "mysunog-notifications.firebaseapp.com",
  projectId: "mysunog-notifications",
  storageBucket: "mysunog-notifications.firebasestorage.app",
  messagingSenderId: "9339166378",
  appId: "1:9339166378:web:5896b2a47c4f99c7be3ad3"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);