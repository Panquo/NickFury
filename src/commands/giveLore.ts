import { EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import {
    NicklessAgentError,
    UnknownAgentError,
} from "../database/models/agent";
import { setAgentNickLore } from "../services/orchestraThor";

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
    const target: GuildMember = interaction.options.getMember(
        "target",
    ) as GuildMember;
    const lore = interaction.options.getString("lore");

    try {
        await setAgentNickLore(target.user.id, lore);
        const embed = new EmbedBuilder()
            .setTitle("📜  Story time !  📜")
            .setDescription(
                `**Agent ${target}, your nickname's lore has been issued :** \n\n> ${lore}\n\n *Stay sharp, and operate with precision* 🎯`,
            )
            .setColor("#77b255")
            .setTimestamp();
        return interaction.reply({ embeds: [embed] });
    } catch (e) {
        let description = `Unexpected Error : ${e}`;
        if (e instanceof NicklessAgentError) {
            description = `${target} doesn't have any nickname yet`;
        } else if (e instanceof UnknownAgentError) {
            description = `${target} is not an known agent`;
        }
        const embed = new EmbedBuilder()
            .setTitle("⚠️  Error while adding lore  ⚠️")
            .setDescription(description)
            .setColor("#f50000")
            .setTimestamp();
        return interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    }
}
