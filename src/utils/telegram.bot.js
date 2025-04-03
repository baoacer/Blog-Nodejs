const TelegramBot = require('node-telegram-bot-api');
const detenv = require('dotenv').config()
const token = process.env.TELEGRAM_BOT_TOKEN    

const bot = new TelegramBot(token, {polling: true})

module.exports = bot    