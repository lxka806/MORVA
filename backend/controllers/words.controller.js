const mongoose = require("mongoose")
const Words = require("../models/words.model");

const addWords = async (req, res) => {
    try {
        const { word, difficulty } = req.body || {};

        const normalizedWord = typeof word === "string" ? word.trim() : ""
        if (!normalizedWord) {
            return res.status(400).json({
                message: "Word is required"
            });
        }

        const newWord = await Words.create({
            owner: req.user._id,
            word: normalizedWord,
            difficulty: difficulty || "medium"
        });

        return res.status(201).json({
            message: "Word added successfully",
            word: newWord
        });

    } catch (e) {
        if (e.name === "ValidationError") {
            return res.status(400).json({ message: e.message });
        }
        console.error(e);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


const getWords = async (req, res) => {
    try {
        const page = Number(req.query.page || 1)
        const limit = Number(req.query.limit || 50)

        if (!Number.isSafeInteger(page) || page < 1 || page > 10000) {
            return res.status(400).json({ message: "Page must be a positive integer" })
        }
        if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
            return res.status(400).json({ message: "Limit must be between 1 and 100" })
        }

        const words = await Words.find({ owner: req.user._id })
            .select("_id word difficulty learned favorite createdAt updatedAt")
            .sort({ createdAt: -1, _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit + 1)
            .lean()
        const hasMore = words.length > limit
        if (hasMore) {
            words.pop()
        }
        res.set("X-Has-More", String(hasMore))

        return res.status(200).json(words);

    } catch (e) {
        console.error(e);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


const getWord = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({
                message: "Word not found"
            });
        }

        const word = await Words.findOne({
            _id: id,
            owner: req.user._id
        })
            .select("_id word difficulty learned favorite createdAt updatedAt")
            .lean();

        if (!word) {
            return res.status(404).json({
                message: "Word not found"
            });
        }

        return res.status(200).json(word);

    } catch (e) {
        console.error(e);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


const editWords = async (req, res) => {
    try {
        const { id } = req.params;
        const { word, difficulty, learned, favorite } = req.body || {};
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({
                message: "Word not found"
            });
        }

        const updateFields = {};

        if (typeof word !== "undefined") {
            if (typeof word !== "string" || !word.trim()) {
                return res.status(400).json({ message: "Word must be a non-empty string" });
            }
            updateFields.word = word.trim();
        }
        if (typeof difficulty !== "undefined") {
            if (!["easy", "medium", "hard"].includes(difficulty)) {
                return res.status(400).json({ message: "Difficulty must be easy, medium, or hard" });
            }
            updateFields.difficulty = difficulty;
        }
        if (typeof learned !== "undefined") {
            if (typeof learned !== "boolean") {
                return res.status(400).json({ message: "Learned must be a boolean" });
            }
            updateFields.learned = learned;
        }
        if (typeof favorite !== "undefined") {
            if (typeof favorite !== "boolean") {
                return res.status(400).json({ message: "Favorite must be a boolean" });
            }
            updateFields.favorite = favorite;
        }
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "At least one field is required" });
        }

        const editedWord = await Words.findOneAndUpdate(
            {
                _id: id,
                owner: req.user._id
            },
            updateFields,
            {
                new: true,
                runValidators: true
            }
        )
            .select("_id word difficulty learned favorite createdAt updatedAt")
            .lean();

        if (!editedWord) {
            return res.status(404).json({
                message: "Word not found"
            });
        }

        return res.status(200).json({
            message: "Word updated successfully",
            word: editedWord
        });

    } catch (e) {
        if (e.name === "ValidationError" || e.name === "CastError") {
            return res.status(400).json({ message: e.message });
        }
        console.error(e);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


const deleteWords = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({
                message: "Word not found"
            });
        }

        const deletion = await Words.deleteOne({
            _id: id,
            owner: req.user._id
        });

        if (deletion.deletedCount === 0) {
            return res.status(404).json({
                message: "Word not found"
            });
        }

        return res.status(200).json({
            message: "Word deleted successfully"
        });

    } catch (e) {
        console.error(e);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


module.exports = {
    addWords,
    getWords,
    getWord,
    editWords,
    deleteWords
};