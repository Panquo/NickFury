import db from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Agent } from "../models/agent";


export async function getAll(): Promise<Agent[]> {
    const querySnapshot = await getDocs(collection(db, "nick"));
    let agents: Agent[] = []
    querySnapshot.forEach((doc) => {
        agents.push(doc.data() as Agent)
        console.log(`${doc.id} => ${doc.data() as Agent}`);
    });
    return agents
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

