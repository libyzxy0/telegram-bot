import { ChatbotConfig } from "@/types";
import TelegramBot, { Message } from "node-telegram-bot-api";

export const handleCommands = (bot: TelegramBot, chatbotConfig: ChatbotConfig) => {
    bot.on("message", async (message: Message) => {
        try {
            const text = message?.text;
            if (!text?.startsWith("/")) return;

            const [command, ...args] = text.split(" ");
            const commandName = command.slice(1);

            await importCommand(commandName, bot, message, args, chatbotConfig);
        } catch (error) {
            console.error("Message handling error:", error);
        }
    });
};

const importCommand = async (
    commandName: string,
    bot: TelegramBot,
    message: Message,
    args: string[],
    chatbotConfig: ChatbotConfig
) => {
    try {
        const { execute, config } = await import(`@/commands/${commandName}`);

        if (!config) {
            throw new Error(`Command '${commandName}' is missing a config.`);
        }

        if(!message.from) return;

        if (
            config.permission &&
            config.permission == "admin" &&
            !chatbotConfig.admins.includes(message?.from.id)
        ) {
            bot.setMessageReaction(message.chat.id, message.message_id, {
                reaction: [
                    {
                        type: "emoji",
                        emoji: "🤬"
                    }
                ]
            });
            bot.sendMessage(
                message.chat.id,
                "⚠️ You don't have a permission to use this command!"
            );
            return;
        }

        await execute({ api: bot, event: message, args, chatbotConfig });
    } catch (error) {
        console.error(`Error executing '${commandName}':`, error);
    }
};
