import { CommandInteraction, GuildMember, Interaction, SlashCommandBuilder } from "discord.js";
import * as nickService from "../services/nickService"
import * as agentService from "../services/agentService"
import { Nick } from "../models/nick";
import { Agent } from "../models/agent";

export const data = new SlashCommandBuilder()
    .setName("lore")
    .setDescription("get a nickname's lore")
    .addStringOption(option =>
        option
            .setName('nickname')
            .setDescription('the desired nickname')
            .setRequired(true))

export async function execute(interaction: any) {

    const nickname = interaction.options.getString('nickname');

    try {
        let nicks: Nick[] = await nickService.findNickByName(nickname)
        return interaction.reply(nicks.map(nick => nick.lore).join(', '));

    } catch (e) {
        console.log(e);

        return interaction.reply(`Error while adding nickname : (${e})`);
    }




}