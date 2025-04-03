const express = require('express')
const app = express()
const router = require('./routers/index')
const path = require('path')
const cors = require('cors')
const generateText = require('./services/chat.service')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
 
app.use(cors({
    origin: '*'
}))

// generateText("ban ten la gi")
const telegramBot = require('./utils/telegram.bot')
telegramBot.on('message', async (msg) => {
    const chatId = msg.chat.id
    const message = msg.text
    const result = await generateText(message)
    telegramBot.sendMessage(chatId, result)
})


// init database
require('./database/init.mongodb')  

// init router
app.use('/', router)

app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    return next(err)
})

app.use((err, req, res, next) => {
    const statusCode = err.status || 500 //server
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: err.stack,
        message: err.message || 'Internal Server Error'
    })
})

module.exports = app



