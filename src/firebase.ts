import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { config } from "./config";

// Initialize Firebase
const app = initializeApp(config.firebaseConfig);
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export const signInWithAnonCredentials = async () => {
    try {
        await signInWithEmailAndPassword(auth, config.firebaseMail, config.firebasePassword);
    } catch (userNotCreatedError) {
        await createUserWithEmailAndPassword(
            auth,
            config.firebaseMail,
            config.firebasePassword,
        );
    }
};

export default db;
