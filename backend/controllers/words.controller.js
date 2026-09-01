const Words = require("../models/words.model");

const addWords = async (req, res) => {
    try {
        const { word, difficulty } = req.body;

        if (!word) {
            return res.status(400).json({
                message: "Word is required"
            });
        }

        const newWord = await Words.create({
            owner: req.user._id,
            word: word.trim(),
            difficulty: difficulty || "medium"
        });

        return res.status(201).json({
            message: "Word added successfully",
            word: newWord
        });

    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


const getWords = async (req, res) => {
    try {
        const words = await Words.find({
            owner: req.user._id
        }).sort({ createdAt: -1 });

        return res.status(200).json(words);

    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


const getWord = async (req, res) => {
    try {
        const { id } = req.params;

        const word = await Words.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!word) {
            return res.status(404).json({
                message: "Word not found"
            });
        }

        return res.status(200).json(word);

    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


const editWords = async (req, res) => {
    try {
        const { id } = req.params;
        const { word, difficulty, learned, favorite } = req.body;

        const updateFields = {};

        if (typeof word !== "undefined") updateFields.word = word.trim ? word.trim() : word;
        if (typeof difficulty !== "undefined") updateFields.difficulty = difficulty;
        if (typeof learned !== "undefined") updateFields.learned = learned;
        if (typeof favorite !== "undefined") updateFields.favorite = favorite;

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
        );

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
        console.log(e);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


const deleteWords = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedWord = await Words.findOneAndDelete({
            _id: id,
            owner: req.user._id
        });

        if (!deletedWord) {
            return res.status(404).json({
                message: "Word not found"
            });
        }

        return res.status(200).json({
            message: "Word deleted successfully"
        });

    } catch (e) {
        console.log(e);

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