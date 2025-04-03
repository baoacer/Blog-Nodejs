const express = require('express')
const router = express.Router()
const CommentController = require('../../controllers/comment.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const AuthUtil = require('../../auth/auth.util')

router.get('', asyncHandler(CommentController.getComment))

router.use(asyncHandler(AuthUtil.authentication))

router.post('', asyncHandler(CommentController.createComment))
router.delete('', asyncHandler(CommentController.deleteComment))

module.exports = router
