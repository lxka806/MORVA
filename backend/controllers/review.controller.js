const mongoose = require("mongoose")
const Review = require("../models/review.model")

const addReview = async (req, res) => {
    try {
        const { star, text } = req.body || {}
        const reviewText = typeof text === "string" ? text.trim() : ""
        const rating = Number(star)

        if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !reviewText) {
            return res.status(400).json({
                message: "A rating from 1 to 5 and review text are required"
            })
        }

        if (reviewText.length > 1000) {
            return res.status(400).json({
                message: "Review text must be 1000 characters or fewer"
            })
        }

        const review = await Review.create({
            name: req.user.name,
            star: rating,
            text: reviewText,
            icon: req.user.name.charAt(0).toUpperCase(),
            USERID: req.user._id
        })

        return res.status(201).json({
            message: "Review added",
            review
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({
                message: "Review not found or unauthorized"
            })
        }

        const deletedReview = await Review.findOneAndDelete({
            _id: id,
            USERID: req.user._id
        })

        if (!deletedReview) {
            return res.status(404).json({
                message: "Review not found or unauthorized"
            })
        }

        return res.status(200).json({
            message: "Review deleted successfully",
            review: deletedReview
        })

    } catch (e) {
        console.error(e)
        return res.status(500).json({
            message: "Server Error"
        })
    }
}


const getReview = async (req, res) => {
    try {
        const page = Number(req.query.page || 1)
        const limit = Number(req.query.limit || 50)

        if (!Number.isSafeInteger(page) || page < 1 || page > 10000) {
            return res.status(400).json({ message: "Page must be a positive integer" })
        }
        if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
            return res.status(400).json({ message: "Limit must be between 1 and 100" })
        }

        const reviews = await Review.find()
            .select("_id name star text icon USERID createdAt")
            .sort({ createdAt: -1, _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit + 1)
            .lean()
        const hasMore = reviews.length > limit
        if (hasMore) {
            reviews.pop()
        }
        res.set("X-Has-More", String(hasMore))

        return res.status(200).json(reviews)
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

module.exports = {
    addReview,
    deleteReview,
    getReview
}