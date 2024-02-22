import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { LorelessNickError, Nick, UnknownNickError } from "../database/models/nick";
import { findNickByName, findNickLoreByName } from "../services/orchestraThor";

export const data = new SlashCommandBuilder()
    .setName("lore")
    .setDescription("get a nickname's lore")
    .addStringOption((option) =>
        option
            .setName("nickname")
            .setDescription("the desired nickname")
            .setRequired(true),
    );

export async function execute(interaction: any) {
    const nickname = interaction.options.getString("nickname");

    try {
        const nicksLores: string[] = await findNickLoreByName(nickname);
        return interaction.reply(nicksLores.join(","));
    } catch (e) {
        let description = `Unexpected Error : ${e}`;
        if (e instanceof LorelessNickError) {
            description = `The nickname "${nickname}" does not have lore yet`;
        } else if (e instanceof UnknownNickError) {
            description = `The nickname "${nickname}" is not known, are you sure it is correctly spelled ?`;
        }
        const embed = new EmbedBuilder()
            .setTitle("Error while adding lore")
            .setDescription(description)
            .setColor("#f50000")
            .setTimestamp();
        return interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    }
}
