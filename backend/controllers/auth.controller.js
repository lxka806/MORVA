const Auth = require("../models/auth.model")
const Word = require("../models/words.model")
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
        const { name, username, email, password } = req.body

        if (!name || !username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const usedEmail = await Auth.findOne({ email })
        const usedUserName = await Auth.findOne({ username })

        if (usedEmail) {
            return res.status(400).json({
                message: "Email is already used"
            })
        }

        
        if (usedUserName) {
            return res.status(400).json({
                message: "Username is already used"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10)

        const user = await Auth.create({
            name,
            username,
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
                username: user.username,
                email: user.email,
                xp: user.xp || 0
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
        const { email, username, password } = req.body

        const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : ""
        const normalizedUsername = typeof username === "string" ? username.trim() : ""

        if ((!normalizedEmail && !normalizedUsername) || !password) {
            return res.status(400).json({
                message: "Email or username and password are required"
            })
        }

        const user = await Auth
            .findOne({
                $or: [
                    { email: normalizedEmail || undefined },
                    { username: normalizedUsername || undefined }
                ]
            })
            .select("+password")

        if (!user) {
            return res.status(400).json({
                message: "Wrong email, username or password"
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
                username: user.username,
                email: user.email,
                xp: user.xp || 0
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
            user: { id: user._id, name: user.name, username: user.username, email: user.email, xp: user.xp || 0 }
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

const getLeaderboard = async (req, res) => {
    try {
        const users = await Auth.find({}, { name: 1, username: 1, xp: 1, createdAt: 1 }).sort({ xp: -1, createdAt: -1 })

        const leaderboard = await Promise.all(
            users.map(async (user) => {
                const [totalWords, learnedWords] = await Promise.all([
                    Word.countDocuments({ owner: user._id }),
                    Word.countDocuments({ owner: user._id, learned: true })
                ])

                return {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    xp: user.xp || 0,
                    totalWords,
                    learnedWords
                }
            })
        )

        const sortedLeaderboard = leaderboard
            .sort((a, b) => b.learnedWords - a.learnedWords || b.totalWords - a.totalWords || b.xp - a.xp)
            .map((user, index) => ({ ...user, rank: index + 1 }))

        return res.status(200).json(sortedLeaderboard)
    } catch (e) {
        console.log(e.message)

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

module.exports = {
    register,
    login,
    me,
    logout,
    getLeaderboard
}