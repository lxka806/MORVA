const express = require("express")
const {
    addReview,
    deleteReview,
    getReview
} = require("../controllers/review.controller")
const protect = require("../middleware/protect")

const reviewRouter = express.Router()

reviewRouter.get("/", getReview)
reviewRouter.post("/", protect, addReview)
reviewRouter.delete("/:id", protect, deleteReview)

module.exports = reviewRouter