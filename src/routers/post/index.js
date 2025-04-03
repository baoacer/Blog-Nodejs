const express = require('express')
const router = express.Router()
const PostController = require('../../controllers/post.controllers')
const asyncHandler = require('../../helpers/asyncHandler')
const AuthUtil = require('../../auth/auth.util')

router.get('',  asyncHandler(PostController.getPosts))
router.get('/:id',  asyncHandler(PostController.getPostById))
router.get('/search/:keyword',  asyncHandler(PostController.searchPost))

router.use(asyncHandler(AuthUtil.authentication))

router.put('/:id',  asyncHandler(PostController.updatePost))
router.delete('/',  asyncHandler(PostController.deletePost))
router.post('', asyncHandler(PostController.createPost))

module.exports = router

