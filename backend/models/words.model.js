const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true
        },

        word: {
            type: String,
            required: true,
            trim: true
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "medium"
        },

        learned: {
            type: Boolean,
            default: false
        },

        favorite: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Word", wordSchema);