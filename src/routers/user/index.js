const express = require('express')
const router = express.Router()
const UserController = require('../../controllers/user.controllers')
const asyncHandler = require('../../helpers/asyncHandler')

router.get('', asyncHandler(UserController.getUserById));

module.exports = router

