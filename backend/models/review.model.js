const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        star: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        text: {
            type: String,
            required: true,
            trim: true
        },
        icon:{
            type: String,
        },
        USERID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            default: null
        }
    },
    {
        timestamps: true
    }
)

reviewSchema.index({ createdAt: -1, _id: -1 })

module.exports = mongoose.model("Review", reviewSchema)