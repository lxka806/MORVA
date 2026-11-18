const JWT = require("jsonwebtoken")
const mongoose = require("mongoose")
const Auth = require("../models/auth.model")

const protect = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.startsWith("Bearer ")
        ? authorization.slice(7)
        : null;
    const token = req.cookies?.token || bearerToken;

    if (!token) {
        return res.status(401).json({
            message: "Not authenticated"
        });
    }

    let decoded
    try {
        decoded = JWT.verify(token, process.env.JWT_SECRETE)
    } catch {
        return res.status(401).json({
            message: "Invalid token"
        })
    }

    if (!mongoose.isValidObjectId(decoded.id)) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }

    const user = await Auth.findById(decoded.id).lean()
    if (!user) {
        return res.status(401).json({
            message: "User not found"
        })
    }

    req.user = user
    return next()
};

module.exports = protect