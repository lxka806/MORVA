const express = require("express")
const authRouter = express.Router()

const {
    register,
    login,
    me,
    logout,
    getLeaderboard
} = require("../controllers/auth.controller")
const protect = require("../middleware/protect")


authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.get("/me", me)
authRouter.post("/logout", logout)
authRouter.get("/leaderboard", protect, getLeaderboard)

module.exports = authRouter