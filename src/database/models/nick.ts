import {
    addDoc,
    getDoc,
    doc,
    setDoc,
    getDocs,
    collection,
} from "firebase/firestore";
import db from "../firebase";

export type Nick = {
    id?: string;
    value: string;
    lore: string;
    shooter?: string;
    target: string;
    timestamp: number;
};
const NICKS_COLLECTION = collection(db, "nick");

async function add(nick: Nick): Promise<string> {
    return addDoc(NICKS_COLLECTION, nick).then((res) => {
        return res.id;
    });
}

async function get(nick_id: string): Promise<Nick> {
    return await getDoc(doc(db, "nick", nick_id)).then((res) => {
        const nick = res.data() as Nick;
        nick.id = res.id;
        return nick;
    });
}

async function update(nick: Nick): Promise<void> {
    setDoc(doc(NICKS_COLLECTION, nick.id), nick);
}

async function getAll(): Promise<Nick[]> {
    return await getDocs(NICKS_COLLECTION).then((querySnapshot) => {
        const nicks: Nick[] = [];
        querySnapshot.forEach((doc) => {
            nicks.push(doc.data() as Nick);
        });
        return nicks;
    });
}

export const NickCollection = {
    add,
    get,
    update,
    getAll,
};

export class UnknownNickError extends Error {
    constructor() {
        super();
        this.name = "UnknownNickError";
    }
}

export class LorelessNickError extends Error {
    constructor() {
        super();
        this.name = "LorelessNickError";
    }
}