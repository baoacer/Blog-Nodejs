const express = require('express')
const router = express.Router()
const ChatController = require('../../controllers/chat.controller')
const asyncHandler = require('../../helpers/asyncHandler')

router.post('', asyncHandler(ChatController.chat))

module.exports = router
