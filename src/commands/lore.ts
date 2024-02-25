import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import {
    LorelessNickError,
    Nick,
    UnknownNickError,
} from "../database/models/nick";
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
        const nicksLores = await findNickByName(nickname);
        const x = nicksLores.map((nick) => {
            const lore =
                nick.lore.length > 1024
                    ? nick.lore.slice(0, 1021) + "..."
                    : nick.lore;
            return {
                name: new Date(nick.timestamp).toLocaleDateString("fr", {
                    day: "numeric",
                    year: "numeric",
                    month: "short",
                }),
                value: lore,
                inline: true,
            };
        });
        
        const embed = new EmbedBuilder()
            .setTitle("💭  Lore list  💭")
            .setDescription(
                `Here is the known lore for "${nickname}" nickname :`,
            )
            .addFields(x)
            .setColor("#24d3ff")
            .setTimestamp();
        return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (e) {
        let description = `Unexpected Error : ${e}`;
        console.log(e);

        if (e instanceof LorelessNickError) {
            description = `The nickname "${nickname}" does not have lore yet`;
        } else if (e instanceof UnknownNickError) {
            description = `The nickname "${nickname}" is not known, are you sure it is correctly spelled ?`;
        }
        const embed = new EmbedBuilder()
            .setTitle("⚠️  Error while requesting lore  ⚠️")
            .setDescription(description)
            .setColor("#f50000")
            .setTimestamp();
        return interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    }
}
