const mongoose = require("mongoose")
const validator  = require("validator")

const authSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate: [validator.isEmail, "Please provide email with valid form"]
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 100,
            select: false
        },

        xp: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Auth", authSchema)