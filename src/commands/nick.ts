import { CommandInteraction, GuildMember, Interaction, SlashCommandBuilder } from "discord.js";
import * as nickService from "../services/nickService"
import * as agentService from "../services/agentService"
import { Nick } from "../models/nick";
import { Agent } from "../models/agent";

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
    .addStringOption(option =>
        option
            .setName('lore')
            .setDescription("the nickname's lore"))

export async function execute(interaction: any) {
    const shooter = interaction.user
    const target: GuildMember = interaction.options.getMember('target') as GuildMember;
    const nickname = interaction.options.getString('nickname');
    const lore = interaction.options.getString('lore');

    const nick: Nick = new Nick(nickname, lore, shooter.id, target.user.id, new Date().getTime())
    try {
        await target?.setNickname(nickname)
        nickService.addNick(nick).then(fbRes => {
            if (fbRes.success) {
                console.log(fbRes.data);

                let agent = new Agent(target.user.id, fbRes.data)
                agentService.setNick(agent).then(res => {
                    if (res.success) {
                        return interaction.reply(`Hey ! ${shooter} changed ${target}'s nickname !`);
                    } else {
                        return interaction.reply(`Error while saving nickname : (${res.error})`);
                    }
                })
            } else {
                return interaction.reply(`Error while adding nickname : (${fbRes.error})`);
            }
        })
    } catch (e) {
        console.log(e);

        return interaction.reply(`Error while changing nickname : (${e})`);
    }




}