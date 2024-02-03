import { CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { Agent } from "../models/agent";
import * as agentService from "../services/agentService"

export const data = new SlashCommandBuilder()
    .setName("recruit")
    .setDescription("recruit a new agent")
    .addUserOption(option =>
        option.setName('target')
            .setDescription('The agent to recruit')
            .setRequired(true))

export async function execute(interaction: CommandInteraction) {
    const target = interaction.options.getMember('target') as GuildMember;
    if (target) {
        if (target.user.bot) {
            return interaction.reply("Bzzt... Error 0101: Bots can't hide behind nicknames...");
        }

        await agentService.recruit(new Agent(target.user.id, target.nickname || undefined)).then(res => {
            if (res.success) {
                return interaction.reply(`Agent ${target} successfully recruited !`);
            } else {
                return interaction.reply(res.error?.message || 'Something went wrong ...');
            }
        })

    }

}