const mongoose = require("mongoose")

const progressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true
        },
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        score: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
)

progressSchema.index({ user: 1, lesson: 1 }, { unique: true })

module.exports = mongoose.model("Progress", progressSchema)
