import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    EmbedBuilder,
    GuildMember,
    SlashCommandBuilder,
} from "discord.js";
import { Nick } from "../database/models/nick";
import { recruitAgent, setAgentNick } from "../services/orchestraThor";
import {
    AlreadyRecruitedAgentError,
    BotAgentError,
    UnknownAgentError,
} from "../database/models/agent";

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

    try {
        if (target.user.bot) {
            throw new BotAgentError();
        }
        await recruitAgent(target.user.id);
        if (target.nickname) {
            const nick: Nick = {
                value: target.nickname,
                lore: "",
                target: target.user.id,
                timestamp: new Date().getTime(),
            };
            setAgentNick(target.user.id, nick);
        }
        const embed = new EmbedBuilder()
            .setTitle("🆕  New agent activated  🆕")
            .setDescription(
                `**Agent ${target} has joined our ranks !** \n\n *Let's continue our missions with added expertise* 🔍`,
            )
            .setColor("#77b255")
            .setTimestamp();
        return interaction.reply({ embeds: [embed] });
    } catch (e) {
        let description = `Unexpected Error : ${e}`;
        if (e instanceof BotAgentError) {
            description =
                "🤖 Bzzt... Error 0101: Bots can't hide behind nicknames...";
        } else if (e instanceof AlreadyRecruitedAgentError) {
            description = `${target} is already an agent ! 🕵️`;
        } else if (e instanceof UnknownAgentError) {
            description = `Something went wrong : ${target} vanished... 😧`;
        }
        const embed = new EmbedBuilder()
            .setTitle("⚠️  Error while recruiting agent  ⚠️")
            .setDescription(description)
            .setColor("#f50000")
            .setTimestamp();
        return interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    }
}
