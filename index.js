require('dotenv').config();

const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const bot = new Telegraf(process.env.bot_token);
const axios = require('axios');


bot.start((ctx) => ctx.reply('Приветствую 👋\nЕсли вы хотите узнать текущую погоду по вашему местоположению, поделитесь со мной своей геопозицией 🧭'));
bot.on('message', async (ctx) => {
   if(ctx.message.location) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&appid=3e27eea69a0077b4973a090669bbfb62&units=metric`;
      const response = await axios.get(url);
      const temp = Math.round(response.data.main.temp); // округляем температуру
      const feelsLike = Math.round(response.data.main.feels_like); // округляем температуру ощущается как
      const windSpeed = Math.round(response.data.wind.speed); // округляем скорость ветра
      ctx.reply(`
      📍 Ваше местоположение: ${response.data.name}\n 
      🌡 Температра: ${temp} °C\n 
      🌡 Температра (ощущается как): ${feelsLike} °C\n 
      💧 Влажность: ${response.data.main.humidity} %\n 
      🪁 Скорость ветра: ${windSpeed} м/с\n 
      ☁️ Облачность: ${response.data.clouds.all} %\n 
      `) 
   }
});

bot.launch();



// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));