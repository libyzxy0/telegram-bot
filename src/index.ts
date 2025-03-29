import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios'
import 'dotenv/config'
import express from 'express'

const app = express();
const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

console.log("Running!")

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/as (.+)/, async (msg, match) => {
  
  const chatId = msg.chat.id;
  
  if(msg.from.id !== 5544405507) {
    return await bot.sendMessage(chatId, "You don't have permission to use this command!");
  }
  
  const resp = match[1];
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const { data } = await axios.post("https://shoti.fbbot.org/api/new-shoti", {
        apikey: process.env.SHOTI_APIKEY,
        url: resp,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

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


bot.onText(/\/shoti/, async (msg) => {
  try {
  const chatId = msg.chat.id;
  const {data} = await axios.get('https://shoti.fbbot.org/api/get-shoti')
  
  const {result} = data;
  const {user} = result;
  
  console.log(result)
  
  await bot.sendVideo(chatId, result.content, { caption: `${user.username}` })
  } catch (error) {
    console.log(error)
  }
});

app.get('/', (_req,res) => {
  res.send("gago ampt")
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => cosnole.log('App is listening of on fucking port: '+ PORT))