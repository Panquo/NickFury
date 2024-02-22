import { EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import { Nick } from "../database/models/nick";
import { setAgentNick } from "../services/orchestraThor";
import { UnknownAgentError } from "../database/models/agent";

export const data = new SlashCommandBuilder()
    .setName("nick")
    .setDescription("Add a nickname to a member")
    .addUserOption((option) =>
        option
            .setName("target")
            .setDescription("the targeted member")
            .setRequired(true),
    )
    .addStringOption((option) =>
        option
            .setName("nickname")
            .setDescription("the desired nickname")
            .setRequired(true),
    )
    .addStringOption((option) =>
        option.setName("lore").setDescription("the nickname's lore"),
    );

export async function execute(interaction: any) {
    const shooter = interaction.user;
    const target: GuildMember = interaction.options.getMember(
        "target",
    ) as GuildMember;
    const nickname = interaction.options.getString("nickname");
    const lore = interaction.options.getString("lore");

    const nick: Nick = {
        value: nickname,
        lore: lore,
        shooter: shooter.id,
        target: target.user.id,
        timestamp: new Date().getTime(),
    };
    try {
        await target?.setNickname(nickname);
        await setAgentNick(target.user.id, nick);
        return interaction.reply(
            `Hey ! ${shooter} changed ${target}'s nickname !`,
        );
    } catch (e) {
        console.log("ERRORORORORORO:", e);

        let description = `Unexpected Error : ${e}`;
        if (e instanceof UnknownAgentError) {
            description = `${target} is not a known agent`;
        }
        const embed = new EmbedBuilder()
            .setTitle("Error while adding nickname")
            .setDescription(description)
            .setColor("#f50000")
            .setTimestamp();
        return interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    }
}
