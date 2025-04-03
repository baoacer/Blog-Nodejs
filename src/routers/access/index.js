const express = require('express')
const router = express.Router()
const AccessController = require('../../controllers/access.controller')
const AuthUtil = require('../../auth/auth.util')
const asyncHandler = require('../../helpers/asyncHandler')

router.post('/sign-up', asyncHandler(AccessController.signUp))
router.post('/sign-in', asyncHandler(AccessController.signIn))

router.use(asyncHandler(AuthUtil.authentication))

router.post('/refresh-token', asyncHandler(AccessController.refreshToken))
router.post('/sign-out', asyncHandler(AccessController.signOut))

module.exports = router