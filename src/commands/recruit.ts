import {
    CommandInteraction,
    GuildMember,
    SlashCommandBuilder,
} from "discord.js";
import { Agent } from "../models/agent";
import * as agentService from "../services/agentService";
import * as nickService from "../services/nickService";
import { Nick } from "../models/nick";

export const data = new SlashCommandBuilder()
    .setName("recruit")
    .setDescription("recruit a new agent")
    .addUserOption((option) =>
        option
            .setName("target")
            .setDescription("The agent to recruit")
            .setRequired(true),
    );

export async function execute(interaction: CommandInteraction) {
    const target = interaction.options.getMember("target") as GuildMember;
    if (target) {
        if (target.user.bot) {
            return interaction.reply(
                "Bzzt... Error 0101: Bots can't hide behind nicknames...",
            );
        }
        const agent: Agent = {
            user_id: target.user.id,
        };
        await agentService
            .recruit(agent)
            .then(() => {
                if (target.nickname) {
                    const nick: Nick = {
                        value: target.nickname,
                        lore: "",
                        target: target.user.id,
                        timestamp: new Date().getTime(),
                    };
                    nickService.addNick(nick).then((res) => {
                        agent.current_nick_id = res;
                        agentService.updateAgentNickname(agent);
                    });
                }
                return interaction.reply(
                    `Agent ${target} successfully recruited !`,
                );
            })
            .catch((error) => {
                return interaction.reply(`Something went wrong : ${error}`);
            });
    }
}
