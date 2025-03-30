import TelegramBot from 'node-telegram-bot-api';
import Shoti from 'shoti'
import 'dotenv/config'
import express from 'express'

const app = express();
const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {
  polling: true
});
const shoti = new Shoti(process.env.SHOTI_APIKEY)

console.log("Running!")

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/as (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;

  if (msg.from.id !== 5544405507) {
    return await bot.sendMessage(chatId, "You don't have permission to use this command!");
  }

  const resp = match[1];
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const data = await shoti.newShoti({
        url: resp
      })

      if (data.code === 400) {
        throw new Error("Failed to add video")
      }

      console.log(data);
      await bot.sendMessage(chatId, "Done!");
      return;
    } catch (error) {
      attempt++;
      console.log(`Attempt ${attempt} failed. Retrying...`, error);
      if (attempt < maxRetries) {
        await bot.sendMessage(chatId, `Retrying... (${attempt}/${maxRetries})`);
      } else {
        await bot.sendMessage(chatId, "Failed after multiple attempts!");
      }
    }
  }
});


/*
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Received your message');
});
*/


bot.onText(/\/start/, async (msg) => {
  try {
    const chatId = msg.chat.id;

    for (let i = 0; i < 100; i++) {
      const result = await shoti.getShoti()

      const {
        user
      } = result;

      console.log(result)

      await bot.sendVideo(chatId, result.content, {
        caption: `${user.username}`
      })
    }

  } catch (error) {
    console.log(error)
  }
});

app.get('/', (_req, res) => {
  res.send("gago ampt")
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('App is listening of on fucking port: '+ PORT))