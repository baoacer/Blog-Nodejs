'use strict'

const express = require('express')
const router = express.Router()

// access
// router.use('/api/acesss', require('./access/index'))

// blog
router.use('/v1/api/chat', require('./chat/index'))
router.use('/v1/api/user', require('./user/index'))
router.use('/v1/api/like', require('./like/index'))
router.use('/v1/api/comment', require('./comment/index'))
router.use('/v1/api/post', require('./post/index'))
router.use('/v1/api/access', require('./access/index'))

module.exports = router