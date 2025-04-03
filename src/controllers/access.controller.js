const { SuccessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController{
    static signUp = async (req, res, next) => {
        new SuccessResponse({
            message: "Sign Up Success",
            metadata: await AccessService.signUp(req.body)
        }).send(res);
    }

    static signIn = async (req, res, next) => {
        try {
            const result = await AccessService.signIn(req.body);

            res.cookie("refreshToken", result.RefreshToken, {
                httpOnly: true,
                secure: false,  
                sameSite: "Strict"
            });
            
            new SuccessResponse({
                message: "Sign In Success",
                metadata: {
                    user: result.user,
                    accessToken: result.AccessToken
                }
            }).send(res);
        } catch (error) {
            next(error); 
        }
    }

    static refreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: "Refresh Token Success",
            metadata: await AccessService.refreshToken({
                refreshToken: req.refreshToken,
                userId: req.user
            })
        }).send(res)
    }

    static signOut = async (req, res, next) => {
        res.clearCookie("refreshToken", {
            httpOnly: true, 
            secure: false,  
            sameSite: "Strict" 
        });
        new SuccessResponse({
            message: "Sign Out Success",
            metadata: await AccessService.signOut(req.user)
        }).send(res)
    }
}

module.exports = AccessController