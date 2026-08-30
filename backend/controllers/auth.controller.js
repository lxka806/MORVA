const Auth = require("../models/auth.model")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

const isProduction = process.env.NODE_ENV === "production"

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const usedEmail = await Auth.findOne({ email })
        const usedUserName = await Auth.findOne({ name })

        if (usedEmail) {
            return res.status(400).json({
                message: "Email is already used"
            })
        }

        
        if (usedUserName) {
            return res.status(400).json({
                message: "Name is already used"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10)

        const user = await Auth.create({
            name,
            email,
            password: hashpassword
        })

        const token = JWT.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRETE,
            {
                expiresIn: "7d"
            }
        )

        res.cookie("token", token, cookieOptions)

        return res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (e) {
        console.log(e.message)

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const user = await Auth
            .findOne({ email: email.toLowerCase().trim() })
            .select("+password")

        if (!user) {
            return res.status(400).json({
                message: "Wrong email or password"
            })
        }

        const comparePassword = await bcrypt.compare(
            password,
            user.password
        )

        if (!comparePassword) {
            return res.status(400).json({
                message: "Wrong email or password"
            })
        }

        const token = JWT.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRETE,
            {
                expiresIn: "7d"
            }
        )

        res.cookie("token", token, cookieOptions)

        return res.status(200).json({
            message: "User login successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (e) {
        console.log(e.message)

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

const me = async (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" })
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRETE)
        const user = await Auth.findById(decoded.id)
        if (!user) {
            return res.status(401).json({ message: "Not authenticated" })
        }

        return res.status(200).json({
            user: { id: user._id, name: user.name, email: user.email }
        })
    } catch (e) {
        return res.status(401).json({ message: "Not authenticated" })
    }
}

const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/"
    })
    return res.status(200).json({ message: "Logged out" })
}
module.exports = {
    register,
    login,
    me,
    logout
}