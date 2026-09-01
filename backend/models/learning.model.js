const mongoose = require("mongoose")

const letterSchema = new mongoose.Schema(
    {
        character: {
            type: String,
            required: true,
            trim: true
        },
        pronunciation: {
            type: String,
            trim: true
        },
        translation: {
            type: String,
            trim: true
        },
        example: {
            type: String,
            trim: true
        }
    },
    { _id: false }
)

const exerciseSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["multiple-choice", "recognition"],
            required: true
        },
        question: {
            type: String,
            required: true,
            trim: true
        },
        options: [
            {
                type: String,
                trim: true
            }
        ],
        correctAnswer: {
            type: String,
            trim: true
        }
    },
    { _id: false }
)

const lessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        order: {
            type: Number,
            required: true,
            default: 0
        },
        letters: [letterSchema],
        exercises: [exerciseSchema]
    },
    {
        timestamps: true
    }
)

lessonSchema.index({ order: 1 })

const Lesson = mongoose.models.Lesson || mongoose.model("Lesson", lessonSchema)

module.exports = Lesson