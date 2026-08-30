const express = require("express")
const authRouter = express.Router()

const {
    register,
    login,
    me,
    logout
} = require("../controllers/auth.controller")


authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.get("/me", me)
authRouter.post("/logout", logout)

module.exports = authRouter