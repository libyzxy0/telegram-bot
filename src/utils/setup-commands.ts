import fs from 'fs';
import path from 'path';

export async function setupCommands(bot) {
  try {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs
      .readdirSync(commandsDir)
      .filter(file => file.endsWith('.js'));

    const commands = await Promise.all(
      commandFiles.map(async (file) => {
        const command = await import(path.join(commandsDir, file));

        return {
          command: command.config.name,
          description: command.config.description,
        };
      })
    );

    await bot.setMyCommands(commands);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}