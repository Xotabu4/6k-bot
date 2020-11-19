import { Telegraf } from 'telegraf'
import got from 'got'

if (!process.env.BOT_TOKEN) {
    throw new Error('BOT_TOKEN env var needed')
}


const bot = new Telegraf(process.env.BOT_TOKEN)
bot.startWebhook('/secret-path', null, 5000)

bot.start((ctx) => ctx.reply('Welcome!'))
// [
// {"ccy":"USD","base_ccy":"UAH","buy":"28.05000","sale":"28.45000"},
// {"ccy":"EUR","base_ccy":"UAH","buy":"33.15000","sale":"33.75000"},
// {"ccy":"RUR","base_ccy":"UAH","buy":"0.35500","sale":"0.39500"},
// {"ccy":"BTC","base_ccy":"USD","buy":"16651.1308","sale":"18403.8814"}
// ]
bot.hears('/exchangeRate', async (ctx) => {
    const body = JSON.parse((await got('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')).body)
    ctx.reply(`
USD покупка: ${body.find(c => c.ccy === 'USD').buy}
USD продажа: ${body.find(c => c.ccy === 'USD').sale}
`)

})

bot.launch()