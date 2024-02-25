import {
    Agent,
    AlreadyRecruitedAgentError,
    NicklessAgentError,
    AgentCollection,
} from "../database/models/agent";
import {
    LorelessNickError,
    Nick,
    UnknownNickError,
} from "../database/models/nick";

import { NickCollection } from "./../database/models/nick";

export async function recruitAgent(agent_id: string): Promise<void> {
    return AgentCollection.exists(agent_id).then(async (res) => {
        if (!res) {
            return AgentCollection.add({ user_id: agent_id });
        } else {
            throw new AlreadyRecruitedAgentError();
        }
    });
}

export async function getAgentNick(agent_id: string): Promise<Nick> {
    return AgentCollection.get(agent_id).then((agent) => {
        if (agent.current_nick_id) return NickCollection.get(agent.current_nick_id);
        throw new NicklessAgentError();
    });
}

export async function setAgentNick(
    agent_id: string,
    nick: Nick,
): Promise<void> {
    return NickCollection.add(nick).then(async (nick_id) => {
        return AgentCollection.update(
            await AgentCollection.get(agent_id).then((agent) => {
                agent.current_nick_id = nick_id;
                return agent;
            }),
        );
    });
}
export async function setAgentNickLore(agent_id: string, lore: string) {
    return AgentCollection.get(agent_id).then((agent: Agent) => {
        if (agent.current_nick_id) {
            return NickCollection.get(agent.current_nick_id).then((nick) => {
                nick.lore = lore;
                return NickCollection.update(nick);
            });
        } else {
            throw new NicklessAgentError();
        }
    });
}

export async function findNickByName(nick_value: string): Promise<Nick[]> {   
    const nicks = (await NickCollection.getAll()).filter(
        (nick) => nick.value === nick_value,
    );
    if (nicks.length) {
        return nicks;
    } else {
        throw new UnknownNickError();
    }
}
export async function findNickLoreByName(
    nick_value: string,
): Promise<string[]> {
    const lores = (await findNickByName(nick_value))
        .map((nick) => nick.lore)
        .filter((lore) => lore);
    if (lores.length) {
        return lores;
    } else {
        throw new LorelessNickError();
    }
}

