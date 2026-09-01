const express = require("express")
const protect = require("../middleware/protect")
const {
    createLesson,
    getLessons,
    getLesson,
    updateLesson,
    deleteLesson,
    completeLesson,
    getUserProgress
} = require("../controllers/learning.controller")

const router = express.Router()

router.get("/lessons", getLessons)
router.get("/lessons/:id", getLesson)

router.post("/lessons", protect, createLesson)
router.put("/lessons/:id", protect, updateLesson)
router.delete("/lessons/:id", protect, deleteLesson)
router.post("/lessons/:id/complete", protect, completeLesson)
router.get("/progress", protect, getUserProgress)

module.exports = router
