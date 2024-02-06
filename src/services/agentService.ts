import db from "../firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { Agent } from "../models/agent";
import * as nickService from "./nickService";
import { Nick } from "../models/nick";

const NamelessAgentError = Error;
const AlreadyRecruitedAgentError = Error;

const UpdateAgentError = Error;
const AddAgentError = Error;
const GetAgentError = Error;
const GetAllAgentError = Error;

const GetAgentNicknameError = Error;
const UpdateNicknameAgentError = Error;
const RecruitingAgentError = Error;

const AGENTS_COLLECTION = collection(db, "agent");


/**
 *  EXPORTED FUNCTIONS
 */


export async function recruit(agent: Agent): Promise<void> {
    return await exists(agent).then(async (res) => {
        if (!res) {
            return add(agent)
                .then()
                .catch((error) => {
                    throw RecruitingAgentError(error);
                });
        } else {
            throw AlreadyRecruitedAgentError();
        }
    });
}

export async function getNick(agent: Agent): Promise<Nick> {
    if (agent.current_nick_id)
        try {
            return nickService.getNick(agent.current_nick_id);
        } catch (e) {
            throw GetAgentNicknameError(String(e));
        }
    throw NamelessAgentError();
}

export async function updateAgentNickname(agent: Agent): Promise<void> {
    try {
        await update(agent);
    } catch (e) {
        throw UpdateNicknameAgentError(String(e));
    }
}

export async function getAgent(agent_id: string): Promise<Agent> {
    return get(agent_id);
}


/**
 *  LOCAL FUNCTIONS
 */


async function exists(agent: Agent): Promise<boolean> {
    return getAgent(agent.user_id).then((res) => (res ? true : false));
}

async function add(agent: Agent): Promise<void> {
    return setDoc(doc(AGENTS_COLLECTION, agent.user_id), {
        current_nick_id: "",
    })
        .then()
        .catch((error) => {
            throw AddAgentError(error);
        });
}

async function get(agent_id: string): Promise<Agent> {
    return getDoc(doc(db, "agent", agent_id))
        .then((res) => {
            const agent = res.data() as Agent;
            agent.user_id = res.id;
            return agent;
        })
        .catch((error) => {
            throw GetAgentError(error);
        });
}

async function update(agent: Agent): Promise<void> {
    return setDoc(doc(AGENTS_COLLECTION, agent.user_id), {
        current_nick_id: agent.current_nick_id,
    })
        .then()
        .catch((error) => {
            throw UpdateAgentError(error);
        });
}

async function getAll(): Promise<Agent[]> {
    return getDocs(AGENTS_COLLECTION)
        .then((querySnapshot) => {
            const agents: Agent[] = [];
            querySnapshot.forEach((doc) => {
                agents.push(doc.data() as Agent);
            });
            return agents;
        })
        .catch((error) => {
            throw GetAllAgentError(error);
        });
}
