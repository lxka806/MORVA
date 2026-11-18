const Auth = require("../models/auth.model")
const Word = require("../models/words.model")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")
const validator = require("validator")

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
        const { name, username, email, password } = req.body || {}
        const normalizedName = typeof name === "string" ? name.trim() : ""
        const normalizedUsername = typeof username === "string" ? username.trim() : ""
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : ""

        if (!normalizedName || !normalizedUsername || !normalizedEmail || typeof password !== "string" || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        if (normalizedName.length < 2 || normalizedName.length > 50
            || normalizedUsername.length < 2 || normalizedUsername.length > 50
            || password.length < 8 || password.length > 100) {
            return res.status(400).json({
                message: "Name, username, or password does not meet the length requirements"
            })
        }
        if (!validator.isEmail(normalizedEmail)) {
            return res.status(400).json({ message: "Please provide email with valid form" })
        }

        const hashpassword = await bcrypt.hash(password, 10)

        const user = await Auth.create({
            name: normalizedName,
            username: normalizedUsername,
            email: normalizedEmail,
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
        if (e.code === 11000) {
            const duplicateField = Object.keys(e.keyPattern || e.keyValue || {})[0]
            const message = duplicateField === "username"
                ? "Username is already used"
                : duplicateField === "email"
                    ? "Email is already used"
                    : "Email or username is already used"

            return res.status(400).json({ message })
        }

        if (e.name === "ValidationError") {
            return res.status(400).json({ message: e.message })
        }

        console.error(e.message)

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}
const login = async (req, res) => {
    try {
        const { email, username, password } = req.body || {}

        const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : ""
        const normalizedUsername = typeof username === "string" ? username.trim() : ""

        if ((!normalizedEmail && !normalizedUsername) || typeof password !== "string" || !password) {
            return res.status(400).json({
                message: "Email or username and password are required"
            })
        }

        const identityQuery = normalizedEmail && normalizedUsername
            ? { $or: [{ email: normalizedEmail }, { username: normalizedUsername }] }
            : normalizedEmail
                ? { email: normalizedEmail }
                : { username: normalizedUsername }
        const user = await Auth.findOne(identityQuery)
            .select("+password")
            .lean()

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
        console.error(e.message)

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

const me = async (req, res) => {
    const user = req.user
    return res.status(200).json({
        user: { id: user._id, name: user.name, username: user.username, email: user.email, xp: user.xp || 0 }
    })
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
        const page = Number(req.query.page || 1)
        const limit = Number(req.query.limit || 50)

        if (!Number.isSafeInteger(page) || page < 1 || page > 10000) {
            return res.status(400).json({ message: "Page must be a positive integer" })
        }
        if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
            return res.status(400).json({ message: "Limit must be between 1 and 100" })
        }

        const users = await Auth.aggregate([
            {
                $lookup: {
                    from: Word.collection.name,
                    let: { userId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$owner", "$$userId"] } } },
                        {
                            $group: {
                                _id: null,
                                totalWords: { $sum: 1 },
                                learnedWords: {
                                    $sum: { $cond: [{ $eq: ["$learned", true] }, 1, 0] }
                                }
                            }
                        }
                    ],
                    as: "wordStats"
                }
            },
            {
                $set: {
                    wordStats: {
                        $ifNull: [
                            { $arrayElemAt: ["$wordStats", 0] },
                            { totalWords: 0, learnedWords: 0 }
                        ]
                    }
                }
            },
            {
                $sort: {
                    "wordStats.learnedWords": -1,
                    "wordStats.totalWords": -1,
                    xp: -1,
                    createdAt: -1
                }
            },
            { $skip: (page - 1) * limit },
            { $limit: limit + 1 },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    name: 1,
                    username: 1,
                    xp: { $ifNull: ["$xp", 0] },
                    totalWords: "$wordStats.totalWords",
                    learnedWords: "$wordStats.learnedWords"
                }
            }
        ]).allowDiskUse(true)
        const hasMore = users.length > limit
        if (hasMore) {
            users.pop()
        }
        res.set("X-Has-More", String(hasMore))

        return res.status(200).json(
            users.map((user, index) => ({
                ...user,
                rank: (page - 1) * limit + index + 1
            }))
        )
    } catch (e) {
        console.error(e.message)

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