const { SuccessResponse } = require("../core/success.response")
const generateText = require('../services/chat.service')

class ChatController{
    static chat = async (req, res, next) => {
      try {
        const { prompt } = req.body
        const message = await generateText(prompt)
        return res.status(200).json(message)
      } catch (error) {
        console.error(error)
      }
    }
}

module.exports = ChatController