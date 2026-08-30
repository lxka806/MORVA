const JWT = require("jsonwebtoken")
const Auth = require("../models/auth.model")

const protect = async (req, res, next) => {
    try {
        console.log("COOKIES:", req.cookies);
        console.log("TOKEN:", req.cookies?.token);

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

        const decoded = JWT.verify(
            token,
            process.env.JWT_SECRETE
        );

        const user = await Auth.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;
        next();

    } catch (e) {
        console.log("PROTECT ERROR:", e.message);

        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = protect