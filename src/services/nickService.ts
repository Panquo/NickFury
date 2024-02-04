import db from "../firebase";
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { Nick } from "../models/nick";
import { FirebaseResponse } from "../models/firebaseHelpers";

const nicksRef = collection(db, "nick");

export async function getAll(): Promise<Nick[]> {
    const querySnapshot = await getDocs(nicksRef);
    let nicks: Nick[] = []
    querySnapshot.forEach((doc) => {
        nicks.push(doc.data() as Nick)
    });
    return nicks
}


export async function addNick(nick: Nick): Promise<FirebaseResponse> {
    try {
        let docRef = await addDoc(nicksRef, {
            lore: nick.lore,
            value: nick.value,
            shooter: nick.shooter,
            target: nick.target,
            timestamp: nick.timestamp
        });
        return { success: true, data: docRef }
    } catch (e) {
        return { success: false, error: { code: 500, message: `Error adding nickname: ${e}` } }
    }
}

// create(tutorial) {
//     return db.add(tutorial);
// }

// update(id, value) {
//     return db.doc(id).update(value);
// }

// delete(id) {
//     return db.doc(id).delete();
// }

