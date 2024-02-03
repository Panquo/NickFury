import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBq202W8HHvvtcwSdAM0uAUiLpqo0_8nxs",
    authDomain: "shield-f2465.firebaseapp.com",
    projectId: "shield-f2465",
    storageBucket: "shield-f2465.appspot.com",
    messagingSenderId: "897376063041",
    appId: "1:897376063041:web:1612172102b63865e540c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default db