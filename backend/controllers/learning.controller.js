const mongoose = require("mongoose")
const Lesson = require("../models/learning.model")
const Progress = require("../models/progress.model")
const Auth = require("../models/auth.model")

const createLesson = async (req, res) => {
    try {
        const { title, description, order, letters, exercises } = req.body || {}
        const normalizedTitle = typeof title === "string" ? title.trim() : ""
        const lessonOrder = Number(order)

        if (!normalizedTitle || order === undefined || order === null || !Number.isFinite(lessonOrder)) {
            return res.status(400).json({
                message: "A title and valid order are required"
            })
        }

        const lesson = await Lesson.create({
            title: normalizedTitle,
            description: description || "",
            order: lessonOrder,
            letters: Array.isArray(letters) ? letters : [],
            exercises: Array.isArray(exercises) ? exercises : []
        })

        return res.status(201).json({
            message: "Lesson created successfully",
            lesson
        })
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message })
        }
        console.error(error.message)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find()
            .select("_id title description order")
            .sort({ order: 1, createdAt: 1, _id: 1 })
            .lean()
        return res.status(200).json({ lessons })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const getLesson = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({ message: "Lesson not found" })
        }

        const lesson = await Lesson.findById(req.params.id)
            .select("_id title description order letters exercises createdAt updatedAt")
            .lean()

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" })
        }

        return res.status(200).json({ lesson })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const updateLesson = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({ message: "Lesson not found" })
        }

        const body = req.body || {}
        const fieldsToUpdate = {}
        if (body.title !== undefined) {
            if (typeof body.title !== "string" || !body.title.trim()) {
                return res.status(400).json({ message: "Title must be a non-empty string" })
            }
            fieldsToUpdate.title = body.title.trim()
        }
        if (body.description !== undefined) {
            if (typeof body.description !== "string") {
                return res.status(400).json({ message: "Description must be a string" })
            }
            fieldsToUpdate.description = body.description
        }
        if (body.order !== undefined) {
            const order = Number(body.order)
            if (!Number.isFinite(order)) {
                return res.status(400).json({ message: "Order must be a number" })
            }
            fieldsToUpdate.order = order
        }
        if (body.letters !== undefined) {
            if (!Array.isArray(body.letters)) {
                return res.status(400).json({ message: "Letters must be an array" })
            }
            fieldsToUpdate.letters = body.letters
        }
        if (body.exercises !== undefined) {
            if (!Array.isArray(body.exercises)) {
                return res.status(400).json({ message: "Exercises must be an array" })
            }
            fieldsToUpdate.exercises = body.exercises
        }
        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ message: "At least one lesson field is required" })
        }

        const lesson = await Lesson.findByIdAndUpdate(id, fieldsToUpdate, {
            new: true,
            runValidators: true
        })
            .select("_id title description order letters exercises createdAt updatedAt")
            .lean()
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" })
        }

        return res.status(200).json({
            message: "Lesson updated successfully",
            lesson
        })
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({ message: error.message })
        }
        console.error(error.message)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const deleteLesson = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({ message: "Lesson not found" })
        }

        const lesson = await Lesson.findById(req.params.id).select("_id").lean()

        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" })
        }

        await Progress.deleteMany({ lesson: lesson._id })
        await Lesson.deleteOne({ _id: lesson._id })

        return res.status(200).json({ message: "Lesson deleted successfully" })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const completeLesson = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({ message: "Lesson not found" })
        }

        const lesson = await Lesson.exists({ _id: id })
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" })
        }

        const progressFields = {
            completed: true,
            score: 100,
            completedAt: new Date()
        }
        let progress = await Progress.findOneAndUpdate(
            { user: req.user._id, lesson: id, completed: { $ne: true } },
            { $set: progressFields },
            { new: true }
        )
            .select("lesson completed score")
            .lean()

        if (!progress) {
            try {
                progress = await Progress.create({
                    user: req.user._id,
                    lesson: id,
                    ...progressFields
                })
            } catch (error) {
                if (error.code !== 11000) {
                    throw error
                }

                const user = await Auth.findById(req.user._id).select("xp").lean()
                return res.status(200).json({
                    message: "Lesson already completed",
                    xpEarned: 0,
                    totalXP: user?.xp || 0
                })
            }
        }

        const user = await Auth.findByIdAndUpdate(
            req.user._id,
            { $inc: { xp: 100 } },
            { new: true }
        )
            .select("xp")
            .lean()

        return res.status(200).json({
            message: "Lesson completed",
            xpEarned: 100,
            totalXP: user?.xp || 0,
            progress: {
                lesson: progress.lesson,
                completed: progress.completed,
                score: progress.score
            }
        })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const getUserProgress = async (req, res) => {
    try {
        const [userProgress, lessons, user] = await Promise.all([
            Progress.find({ user: req.user._id })
                .select("lesson completed score")
                .lean(),
            Lesson.find()
                .select("_id title")
                .sort({ order: 1, createdAt: 1, _id: 1 })
                .lean(),
            Auth.findById(req.user._id).select("xp").lean()
        ])
        const progressByLesson = new Map(
            userProgress.map((item) => [item.lesson.toString(), item])
        )
        const completedLessons = userProgress.filter((item) => item.completed).length
        const progress = lessons.map((lesson) => {
            const record = progressByLesson.get(lesson._id.toString())
            return {
                lesson: lesson.title,
                completed: Boolean(record?.completed),
                score: record?.score || 0
            }
        })

        return res.status(200).json({
            xp: user?.xp || 0,
            completedLessons,
            progress
        })
    } catch (error) {
        console.error(error.message)
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


