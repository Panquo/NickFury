import db from "../firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { Agent } from "../models/agent";
import * as nickService from "./nickService";
import { Nick } from "../models/nick";

const NamelessAgentError = Error()
const AlreadyRecruitedAgent = Error()

const UpdateAgentError = Error
const AddAgentError = Error
const GetAgentError = Error
const GetAllAgentError = Error

const GetAgentNicknameError = Error
const UpdateNicknameAgentError = Error
const RecruitingAgentError = Error

const agentsRef = collection(db, "agent");

export async function recruit(agent: Agent): Promise<void> {
    return await exists(agent).then(async res => {
        if (!res) {
            return add(agent)
                .then()
                .catch(error => { throw RecruitingAgentError(error) })
        } else {
            throw AlreadyRecruitedAgent
        }
    })
}
export async function getNick(agent: Agent): Promise<Nick> {
    if (agent.current_nick_id)
        try {
            return nickService.getNick(agent.current_nick_id)
        } catch (e: any) {
            throw GetAgentNicknameError(e)
        }
    throw NamelessAgentError
}


export async function updateAgentNickname(agent: Agent): Promise<void> {
    try {
        await update(agent)
    } catch (e: any) {
        throw UpdateNicknameAgentError(e)
    }
}




async function exists(agent: Agent): Promise<boolean> {
    return getAgent(agent.user_id)
        .then(res => res ? true : false)
}
export async function getAgent(agent_id: string): Promise<Agent> {
    return get(agent_id)
}


async function add(agent: Agent): Promise<void> {
    return setDoc(doc(agentsRef, agent.user_id), {
        current_nick_id: ""
    })
        .then()
        .catch(error => { throw AddAgentError(error) })
}

async function get(agent_id: string): Promise<Agent> {
    return getDoc(doc(db, "agent", agent_id))
        .then(res => { let agent = res.data() as Agent; agent.user_id = res.id; return agent })
        .catch(error => { throw GetAgentError(error) })
}

async function update(agent: Agent): Promise<void> {
    return setDoc(doc(agentsRef, agent.user_id), {
        current_nick_id: agent.current_nick_id
    })
        .then()
        .catch(error => { throw UpdateAgentError(error) })
}


async function getAll(): Promise<Agent[]> {
    return getDocs(agentsRef)
        .then(querySnapshot => {
            let agents: Agent[] = []
            querySnapshot.forEach((doc) => {
                agents.push(doc.data() as Agent)
            });
            return agents
        })
        .catch(error => { throw GetAllAgentError(error) })
}

