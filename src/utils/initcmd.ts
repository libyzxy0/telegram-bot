// @ts-ignore

import fs from 'fs';
import TelegramBot from 'node-telegram-bot-api';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupCommands(bot: TelegramBot) {
  try {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs
      .readdirSync(commandsDir)
      .filter(file => file.endsWith(path.extname(import.meta.filename)));

    const commands = await Promise.all(
      commandFiles.map(async file => {
        const command = await import(
          pathToFileURL(path.join(commandsDir, file)).href
        );

        return {
          command: command.config.name,
          description: command.config.description,
        };
      })
    );

    await bot.setMyCommands(commands);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
  }
}