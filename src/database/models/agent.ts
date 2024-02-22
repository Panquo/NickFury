import { setDoc, doc, getDoc, getDocs, collection } from "firebase/firestore";
import db from "../firebase";

export type Agent = {
    user_id: string;
    current_nick_id?: string;
};

const AGENTS_COLLECTION = collection(db, "agent");

async function exists(agent_id: string): Promise<boolean> {
    return get(agent_id)
        .then(() => true)
        .catch((error) => {
            console.log(typeof error);

            if (error instanceof UnknownAgentError) {
                return false;
            } else {
                throw error;
            }
        });
}

async function add(agent: Agent): Promise<void> {
    return setDoc(doc(AGENTS_COLLECTION, agent.user_id), {
        current_nick_id: "",
    });
}

async function get(agent_id: string): Promise<Agent> {
    return getDoc(doc(db, "agent", agent_id)).then((res) => {
        let agent;
        if (res.data()) {
            agent = res.data() as Agent;
            agent.user_id = res?.id;
            return agent;
        }
        throw new UnknownAgentError();
    });
}

async function update(agent: Agent): Promise<void> {
    return setDoc(doc(AGENTS_COLLECTION, agent.user_id), {
        current_nick_id: agent.current_nick_id,
    });
}

async function getAll(): Promise<Agent[]> {
    return getDocs(AGENTS_COLLECTION).then((querySnapshot) => {
        const agents: Agent[] = [];
        querySnapshot.forEach((doc) => {
            agents.push(doc.data() as Agent);
        });
        return agents;
    });
}

export const AgentCollection = {
    exists,
    add,
    get,
    update,
    getAll,
};

export class UnknownAgentError extends Error {
    constructor() {
        super("This agent is not known around here");
        this.name = "UnknownAgentError";
    }
}
export class AlreadyRecruitedAgentError extends Error {
    constructor() {
        super("This agent has already been recruited !");
        this.name = "AlreadyRecruitedAgentError";
    }
}
export class NicklessAgentError extends Error {
    constructor() {
        super("This agent has no nickname yet !");
        this.name = "NicklessAgentError";
    }
}
export class BotAgentError extends Error {
    constructor() {
        super("This agent has no nickname yet !");
        this.name = "NicklessAgentError";
    }
}
