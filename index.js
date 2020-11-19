const TelegramBot = require('node-telegram-bot-api');
const got = require('got')

const options = {
    // Use pooling for local debug only.
    // polling: true
    webHook: {
        // Port to which you should bind is assigned to $PORT variable
        // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
        port: process.env.PORT
        // you do NOT need to set up certificates since Heroku provides
        // the SSL certs already (https://<app-name>.herokuapp.com)
        // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
    }
};
// Heroku routes from port :443 to $PORT
// Add URL of your app to env variable or enable Dyno Metadata
// to get this automatically
// See: https://devcenter.heroku.com/articles/dyno-metadata
const url = process.env.APP_URL || 'https://sixkbot.herokuapp.com:443';
const bot = new TelegramBot(process.env.BOT_TOKEN, options);

// This informs the Telegram servers of the new webhook.
// Note: we do not need to pass in the cert, as it already provided
bot.setWebHook(`${url}/bot${process.env.BOT_TOKEN}`);

bot.onText(/\/exchangeRate/, async (msg, match) => {
    const body = JSON.parse((await got('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')).body)
    const reply = 
`
PrivatBank 💵
USD покупка: ${body.find(c => c.ccy === 'USD').buy}
USD продажа: ${body.find(c => c.ccy === 'USD').sale}
`
    bot.sendMessage(msg.chat.id, reply)
})