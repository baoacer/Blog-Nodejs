const express = require('express')
const router = express.Router()
const ChatController = require('../../controllers/chat.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const AuthUtil = require('../../auth/auth.util')

router.use(asyncHandler(AuthUtil.authentication))
router.post('', asyncHandler(ChatController.chat))

module.exports = router
