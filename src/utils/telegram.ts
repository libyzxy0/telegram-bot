import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;

if(!token) {
    throw new Error("Pleasse specify your bot token on environment variables.")
}

export const bot = new TelegramBot(token, {
    polling: true
});