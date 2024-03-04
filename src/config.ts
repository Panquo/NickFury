import dotenv from "dotenv";

dotenv.config();

const {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    DISCORD_GUILD_ID,
    firebaseMail,
    firebasePassword,
    FIRESTORE_APIKEY,
    FIRESTORE_AUTHDOMAIN,
    FIRESTORE_PROJECTID,
    FIRESTORE_STORAGEBUCKET,
    FIRESTORE_MESSAGINGSENDERID,
    FIRESTORE_APPID,
} = process.env;

const firebaseConfig = {
    apiKey: FIRESTORE_APIKEY,
    authDomain: FIRESTORE_AUTHDOMAIN,
    projectId: FIRESTORE_PROJECTID,
    storageBucket: FIRESTORE_STORAGEBUCKET,
    messagingSenderId: FIRESTORE_MESSAGINGSENDERID,
    appId: FIRESTORE_APPID,
};


if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
    throw new Error("Missing Discord environment variables");
}
if (!firebaseMail || !firebasePassword) {
    throw new Error("Missing Firebase environment variables");
}

export const config = {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    DISCORD_GUILD_ID,
    firebaseConfig,
    firebaseMail,
    firebasePassword,
};
