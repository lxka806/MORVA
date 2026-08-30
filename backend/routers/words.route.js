const express = require("express");

const router = express.Router();

const {
    addWords,
    getWords,
    getWord,
    editWords,
    deleteWords
} = require("../controllers/words.controller");

const protect = require("../middleware/protect");

router.post("/", protect, addWords);

router.get("/", protect, getWords);

router.get("/:id", protect, getWord);

router.put("/:id", protect, editWords);

router.delete("/:id", protect, deleteWords);

module.exports = router;