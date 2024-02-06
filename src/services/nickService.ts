import db from "../firebase";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
} from "firebase/firestore";
import { type Nick } from "../models/nick";

const UpdateNickError = Error;
const AddNickError = Error;
const GetNickError = Error;
const GetAllNickError = Error;

const UpdateLoreError = Error;

const NICKS_COLLECTION = collection(db, "nick");

export async function setLore(nick_id: string, lore: string): Promise<void> {
    await get(nick_id)
        .then(async (nick) => {
            nick.lore = lore;
            await update(nick)
                .then()
                .catch((error) => {
                    throw UpdateLoreError(error);
                });
        })
        .catch((error) => {
            throw GetNickError(error);
        });
}
export async function findNickByName(nick_value: string): Promise<Nick[]> {
    return (await getAll()).filter((nick) => nick.value === nick_value);
}

export async function addNick(nick: Nick): Promise<string> {
    return await add(nick)
        .then((res) => res)
        .catch((error) => {
            throw AddNickError(error);
        });
}
export async function getNick(nick_id: string): Promise<Nick> {
    return await get(nick_id)
        .then((res) => {
            return res;
        })
        .catch((error) => {
            throw GetNickError(error);
        });
}
async function add(nick: Nick): Promise<string> {
    return await addDoc(NICKS_COLLECTION, nick)
        .then((res) => {
            return res.id;
        })
        .catch((error) => {
            throw AddNickError(error);
        });
}

async function get(nick_id: string): Promise<Nick> {
    return await getDoc(doc(db, "nick", nick_id))
        .then((res) => {
            const nick = res.data() as Nick;
            nick.id = res.id;
            return nick;
        })
        .catch((error) => {
            throw GetNickError(error);
        });
}

async function update(nick: Nick): Promise<void> {
    await setDoc(doc(NICKS_COLLECTION, nick.id), nick)
        .then()
        .catch((error) => {
            throw UpdateNickError(error);
        });
}

async function getAll(): Promise<Nick[]> {
    return await getDocs(NICKS_COLLECTION)
        .then((querySnapshot) => {
            const nicks: Nick[] = [];
            querySnapshot.forEach((doc) => {
                nicks.push(doc.data() as Nick);
            });
            return nicks;
        })
        .catch((error) => {
            throw GetAllNickError(error);
        });
}
