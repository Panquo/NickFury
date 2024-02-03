import { CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import * as agentService from "../services/agentService"

export const data = new SlashCommandBuilder()
    .setName("nick")
    .setDescription("Add a nickname to a member")
    .addUserOption(option =>
        option
            .setName('target')
            .setDescription('the targeted member')
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName('nickname')
            .setDescription('the desired nickname')
            .setRequired(true))

export async function execute(interaction: any) {
    const shooter = interaction.user
    const target: GuildMember = interaction.options.getMember('target') as GuildMember;
    const nickname = interaction.options.getString('nickname');

    agentService.getAll()


    target?.setNickname(nickname)
    return interaction.reply(`Hey ! ${shooter} changed ${target}'s nickname !`);

}