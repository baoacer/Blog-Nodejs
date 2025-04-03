require('dotenv').config()
const { BadRequestError } = require('../core/error.response')
const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bycrypt = require('bcrypt')
const UserService = require('./user.service')
const AuthUtil = require('../auth/auth.util')

class AccessService{
    static signUp = async (payload) => {
        const { email, password } = payload
        const existsUser = await UserModel.findOne({
            email: email},
            "email"
        ).lean()

        if(existsUser){
            throw new BadRequestError("Email already exists")
        }

        const passwordHash = await bycrypt.hash(password, 10)

        const newUser = await UserModel.create({
            ...payload, password:passwordHash
        })

        return newUser
    }

    static signIn = async ({ email, password }) => {
        // 1 - check exists user
        const existsUser = await UserService.findByEmail(email)
        if(!existsUser) throw new BadRequestError("User Not SignUp")

        // 2 - compare password
        const match = await bycrypt.compare(password, existsUser.password)
        if(!match) throw new AuthFailureError("Incorrect Password Or Email")

        // 3 - generate token
        const accessToken = AuthUtil.createAccessToken(existsUser._id)
        const refreshToken = AuthUtil.createRefreshToken(existsUser._id)

        // 4 - return
        return {
            user: {
                id: existsUser._id,
                username: existsUser.username,
                email: existsUser.email
            },
            AccessToken: accessToken,
            RefreshToken: refreshToken
        }
    }

    static signOut = async (userId) => {
        const existsUser = await UserModel.findById(userId)
        if(!existsUser) throw new BadRequestError("User Not SignUp")

        existsUser.refreshToken = null
        existsUser.save()
    }

    static refreshToken = async ({refreshToken, userId}) => {
        // check user
        const existsUser = await UserModel.findById(userId)
        if(!existsUser) throw new BadRequestError("User Not SignUp")

        // decode
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        // check decode
        if(existsUser._id != decoded.id) throw new BadRequestError("User Not SignUp")

        // generate token
        const newAccessToken = AuthUtil.createAccessToken(existsUser._id)
        const newRefreshToken = AuthUtil.createRefreshToken(existsUser._id)

        // save token
        existsUser.refreshToken = newRefreshToken
        existsUser.save()

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }
    }
}

module.exports = AccessService