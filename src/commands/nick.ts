import {
    CommandInteraction,
    GuildMember,
    Interaction,
    SlashCommandBuilder,
} from "discord.js";
import * as nickService from "../services/nickService";
import * as agentService from "../services/agentService";
import { Nick } from "../models/nick";
import { Agent } from "../models/agent";

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
    await target?.setNickname(nickname);
    nickService
        .addNick(nick)
        .then((nick_id) => {
            const agent: Agent = {
                user_id: target.user.id,
                current_nick_id: nick_id,
            };
            agentService
                .updateAgentNickname(agent)
                .then(() => {
                    return interaction.reply(
                        `Hey ! ${shooter} changed ${target}'s nickname !`,
                    );
                })
                .catch((error) => {
                    return interaction.reply(
                        `Error while updating nickname : (${error})`,
                    );
                });
        })
        .catch((error) => {
            return interaction.reply(
                `Error while changing nickname : (${error})`,
            );
        });
}
