import { bot } from "@/config";

export const handleCommands = () => {
    bot.on("message", message => {
        try {
            const command = message?.text?.split(" ")[0];
            const args = message?.text?.split(" ");
            args.shift();

            if (command.startsWith("/")) {
                import(`@/commands/${command?.split("/")[1]}`)
                    .then(async ({ execute }) => {
                        try {
                            await execute({ api: bot, event: message, args })
                        } catch (error) {
                            console.log("Command error:", error);
                        }
                    })
                    .catch(error => {
                        console.log(error.message);
                    });
            }
        } catch (error) {
            console.log(error);
        }
    });
};
