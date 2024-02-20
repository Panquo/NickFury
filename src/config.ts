import dotenv from "dotenv";
import { firebaseConfig } from "./firebaseConfig";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID, firebaseMail,firebasePassword } = process.env;

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
