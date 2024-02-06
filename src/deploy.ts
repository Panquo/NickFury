import { config } from "./config";
import { deployCommands } from "./deploy-commands";

const server_id: string = process.env.npm_config_server_id || config.DISCORD_GUILD_ID || "";

deployCommands({ guildId: server_id });
