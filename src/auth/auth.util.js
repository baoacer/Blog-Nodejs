require("dotenv").config();
const jwt = require("jsonwebtoken");
const { AuthFailureError } = require("../core/error.response");

const HEADER = {
  CLIENT_ID: "x-client-id",
  REFRESHTOKEN: "x-rtoken",
  AUTHORIZATION: "authorization",
};

class AuthUtil {
  static createAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "2d",
    });
  };

  static createRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
  };

  static authentication = async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("Invalid Request");

    // 3 - get refreshToken from headers (authorization)
    if (req.headers[HEADER.REFRESHTOKEN]) {
      try {
        const refreshToken = req.headers[HEADER.REFRESHTOKEN];
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        if (userId !== decode.id) throw new AuthFailureError("Invalid userId")
        req.user = userId
        req.refreshToken = refreshToken
        return next();
      } catch (error) {
        throw error;
      }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError("Invalid request");
    try {
      const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
      if (userId !== decode.id) throw new AuthFailureError("Invalid userId")
      req.user = userId;
      return next();
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = AuthUtil
