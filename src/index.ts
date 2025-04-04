import chalk from "chalk";
import { bot } from "@/utils/telegram";
import { chatbotConfig } from "@/config";
import { handleCommands } from "@/utils/handle-commands";
import { setupCommands } from "@/utils/setup-commands";
import "@/keep_alive";

const setupChatbot = async () => {
  const { name } = await bot.getMyName();
  
  await setupCommands(bot);
  console.log(chalk.cyan.bold("[SYSTEM]: Commands set up!"));
  
  await handleCommands(bot, chatbotConfig);
  console.log(chalk.cyan.bold("[SYSTEM]: Ready to accept user commands!"));

  console.log(
    chalk.cyan.bold("[SYSTEM]: Chatbot Name:") + " " + chalk.black.bold.bgCyan.bold(name)
  );
};

setupChatbot();
