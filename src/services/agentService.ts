import db from "../firebase";
import { collection, getDocs, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { Agent } from "../models/agent";
import { FirebaseResponse } from "../models/firebaseHelpers";

const agentsRef = collection(db, "agent");

export async function getAll(): Promise<Agent[]> {
    const querySnapshot = await getDocs(agentsRef);
    let agents: Agent[] = []
    querySnapshot.forEach((doc) => {
        agents.push(doc.data() as Agent)
        console.log(`${doc.id} => ${doc.data() as Agent}`);
    });
    console.log(agents);

    return agents
}

async function exists(agent: Agent): Promise<boolean> {
    const docRef = doc(db, "agent", agent.user_id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return true
    } else {
        return false
    }
}

export async function recruit(agent: Agent): Promise<FirebaseResponse> {
    return exists(agent).then(async res => {
        if (!res) {
            try {
                await setDoc(doc(agentsRef, agent.user_id), {
                    current_nick: agent.current_nick || ""
                });
                return { success: true }
            } catch (e) {
                return { success: false, error: { code: 500, message: `Error recruiting agent: ${e}` } }
            }
        } else {
            return { success: false, error: { code: 444, message: "Agent is already recruited" } }
        }
    })
}

// update(id, value) {
//     return db.doc(id).update(value);
// }

// delete(id) {
//     return db.doc(id).delete();
// }

