const express = require('express')
const router = express.Router()
const LikeController = require('../../controllers/like.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const AuthUtil = require('../../auth/auth.util')

router.get('', asyncHandler(LikeController.getLike))

router.use(asyncHandler(AuthUtil.authentication))

router.post('', asyncHandler(LikeController.togglelikePost))

module.exports = router
