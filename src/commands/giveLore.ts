import {
    CommandInteraction,
    GuildMember,
    Interaction,
    SlashCommandBuilder,
} from "discord.js";
import * as nickService from "../services/nickService";
import * as agentService from "../services/agentService";
import { Nick } from "../models/nick";
import { Agent } from "../models/agent";

export const data = new SlashCommandBuilder()
    .setName("givelore")
    .setDescription("Add lore to a members nickname")
    .addUserOption((option) =>
        option
            .setName("target")
            .setDescription("the targeted member")
            .setRequired(true),
    )
    .addStringOption((option) =>
        option
            .setName("lore")
            .setDescription("the nickname's lore")
            .setRequired(true),
    );

export async function execute(interaction: any) {
    const shooter = interaction.user;
    const target: GuildMember = interaction.options.getMember(
        "target",
    ) as GuildMember;
    const lore = interaction.options.getString("lore");

    try {
        const agent: Agent = await agentService.getAgent(target.user.id);
        console.log(agent);

        if (agent.current_nick_id) {
            nickService.setLore(agent.current_nick_id, lore);
            return interaction.reply(
                `Hey ! ${shooter} changed ${target}'s nickname lore !`,
            );
        } else {
            return interaction.reply(
                "The targeted agent has no nickname yet, add him one !",
            );
        }
    } catch (e) {
        return interaction.reply(`Error while changing lore : (${e})`);
    }
}
