export const handleCommands = (bot, chatbotConfig) => {
    bot.on("message", async message => {
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
    commandName,
    bot,
    message,
    args,
    chatbotConfig
) => {
    try {
        const { execute, config } = await import(`@/commands/${commandName}`);

        if (!config) {
            throw new Error(`Command '${commandName}' is missing a config.`);
        }

        if (
            config.permission &&
            config.permission == "admin" &&
            !chatbotConfig.admins.includes(message.from.id)
        ) {
            bot.setMessageReaction(message.chat.id, message.message_id, {
                reaction: JSON.stringify([
                    {
                        type: "emoji",
                        emoji: "🤬"
                    }
                ])
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
