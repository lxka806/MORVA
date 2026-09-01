const Lesson = require("../models/learning.model")
const Progress = require("../models/progress.model")
const Auth = require("../models/auth.model")

const createLesson = async (req, res) => {
    try {
        const { title, description, order, letters, exercises } = req.body

        if (!title || order === undefined || order === null) {
            return res.status(400).json({
                message: "Title and order are required"
            })
        }

        const lesson = await Lesson.create({
            title,
            description: description || "",
            order: Number(order),
            letters: Array.isArray(letters) ? letters : [],
            exercises: Array.isArray(exercises) ? exercises : []
        })

        return res.status(201).json({
            message: "Lesson created successfully",
            lesson
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find().sort({ order: 1, createdAt: 1 })
        return res.status(200).json({ lessons })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const getLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id)

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" })
        }

        return res.status(200).json({ lesson })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id)

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" })
        }

        const fieldsToUpdate = req.body

        Object.keys(fieldsToUpdate).forEach((key) => {
            if (fieldsToUpdate[key] !== undefined) {
                lesson[key] = key === "order" ? Number(fieldsToUpdate[key]) : fieldsToUpdate[key]
            }
        })

        await lesson.save()

        return res.status(200).json({
            message: "Lesson updated successfully",
            lesson
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id)

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" })
        }

        await Progress.deleteMany({ lesson: lesson._id })
        await lesson.deleteOne()

        return res.status(200).json({ message: "Lesson deleted successfully" })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const completeLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id)

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" })
        }

        const existingProgress = await Progress.findOne({
            user: req.user._id,
            lesson: lesson._id
        })

        if (existingProgress && existingProgress.completed) {
            const user = await Auth.findById(req.user._id)

            return res.status(200).json({
                message: "Lesson already completed",
                xpEarned: 0,
                totalXP: user?.xp || 0
            })
        }

        const progress = await Progress.findOneAndUpdate(
            { user: req.user._id, lesson: lesson._id },
            {
                user: req.user._id,
                lesson: lesson._id,
                completed: true,
                score: 100,
                completedAt: new Date()
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )

        const user = await Auth.findById(req.user._id)
        const nextXP = Number(user?.xp || 0) + 100

        user.xp = nextXP
        await user.save()

        return res.status(200).json({
            message: "Lesson completed",
            xpEarned: 100,
            totalXP: nextXP,
            progress: {
                lesson: lesson._id,
                completed: progress.completed,
                score: progress.score
            }
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const getUserProgress = async (req, res) => {
    try {
        const userProgress = await Progress.find({ user: req.user._id })
            .populate("lesson", "title")
            .sort({ createdAt: -1 })

        const user = await Auth.findById(req.user._id)
        const completedLessons = userProgress.filter((item) => item.completed).length

        const lessons = await Lesson.find().sort({ order: 1, createdAt: 1 })

        const progress = lessons.map((lesson) => {
            const record = userProgress.find((item) => 
                item.lesson && item.lesson._id.toString() === lesson._id.toString()
            )

            return {
                lesson: lesson.title,
                completed: !!record?.completed,
                score: record?.score || 0
            }
        })

        // Make sure user.xp exists and is a number
        const userXP = user?.xp || 0;
        console.log("User XP:", userXP); // Debug log

        return res.status(200).json({
            xp: userXP,
            completedLessons,
            progress
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Something went wrong" })
    }
}
module.exports = {
    createLesson,
    getLessons,
    getLesson,
    updateLesson,
    deleteLesson,
    completeLesson,
    getUserProgress
}


