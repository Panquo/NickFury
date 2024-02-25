import {
    ActionRowBuilder,
    CommandInteraction,
    ComponentType,
    EmbedBuilder,
    GuildMember,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from "discord.js";
import { Nick } from "../database/models/nick";
import { recruitAgent, setAgentNick } from "../services/orchestraThor";
import {
    AlreadyRecruitedAgentError,
    BotAgentError,
    UnknownAgentError,
} from "../database/models/agent";

export const data = new SlashCommandBuilder()
    .setName("test")
    .setDescription("test embeds purpose");

export async function execute(interaction: CommandInteraction) {
    const select = new StringSelectMenuBuilder()
        .setCustomId("starter")
        .setPlaceholder("Make a selection!")
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel("Bulbasaur")
                .setDescription("The dual-type Grass/Poison Seed Pokémon.")
                .setValue("bulbasaur"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Charmander")
                .setDescription("The Fire-type Lizard Pokémon.")
                .setValue("charmander"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Squirtle")
                .setDescription("The Water-type Tiny Turtle Pokémon.")
                .setValue("squirtle"),
        );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        select,
    );

    const response = await interaction.reply({
        content: "Choose your starter!",
        components: [row],
    });

    try {
        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 3_600_000,
        });

        collector.on("collect", async (i) => {
            const selection = i.values[0];
            await i.update({
                content: `${i.user} has selected ${selection}!`,
                components: [],
            });
        });
    } catch (e) {
        await interaction.editReply({
            content: "Confirmation not received within 1 minute, cancelling",
            components: [],
        });
    }
}
