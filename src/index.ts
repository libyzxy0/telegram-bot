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


bot.onText(/\/ishoti/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const result = await shoti.getShoti({
      "type": "image"
    })
    await bot.setMessageReaction(chatId, msg.message_id, {
      reaction: JSON.stringify([{
        type: 'emoji', emoji: '🔥'
      }])
    })

    const {
      user,
      content
    } = result;
    const media = content.map(url => {
      return {
        type: 'photo',
        media: url,
        caption: `${user.username}`
      }
    })
    await bot.sendMediaGroup(chatId, media)
  } catch (error) {
    bot.sendMessage(chatId, "Agai, nag error pare.");
    console.log(error.message)
  }
})

bot.onText(/\/shoti/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const result = await shoti.getShoti()
    await bot.setMessageReaction(chatId, msg.message_id, {
      reaction: JSON.stringify([{
        type: 'emoji', emoji: '🔥'
      }])
    })
    const {
      user
    } = result;
    await bot.sendVideo(chatId, result.content, {
      caption: `${user.username}`
    })
  } catch (error) {
    bot.sendMessage(chatId, "Agai, nag error pare.");
    console.log(error.message)
  }
});

app.get('/', (_req, res) => {
  res.send("gago ampt")
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('App is listening of on fucking port: '+ PORT))