const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const compression = require("compression")
const requestTiming = require("./middleware/requestTiming")

const authRouter = require("./routers/auth.route")
const wordsRoute = require("./routers/words.route");
const learningRoute = require("./routers/learning.route");
const reviewRoute = require("./routers/review.route")

const app = express()

const PORT = process.env.PORT || 3000

app.disable("x-powered-by")
app.use(requestTiming)
app.use(cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["X-Has-More"]
}));
app.use(compression())
app.use(express.json({ limit: "1mb" }))
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/words", wordsRoute);
app.use("/api/learning", learningRoute);
app.use("/api/reviews", reviewRoute)

app.use((req, res) => {
    return res.status(404).json({ message: "Route not found" })
})

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }

    const errorStatus = error.status || error.statusCode
    const statusCode = Number.isInteger(errorStatus) && errorStatus >= 400 && errorStatus < 500
        ? errorStatus
        : 500
    if (statusCode === 500) {
        console.error(`[api-error] ${req.method} ${req.path}: ${error.message}`)
    }

    return res.status(statusCode).json({
        message: statusCode === 500 ? "Something went wrong" : error.message
    })
})

const slowDatabaseThreshold = Number.isFinite(Number(process.env.SLOW_DB_THRESHOLD_MS))
    ? Math.max(0, Number(process.env.SLOW_DB_THRESHOLD_MS))
    : 100

mongoose.connection.on("error", (error) => {
    console.error(`[mongodb] ${error.message}`)
})
mongoose.connection.on("disconnected", () => {
    console.warn("[mongodb] disconnected; driver will attempt to reconnect")
})

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 10,
            serverSelectionTimeoutMS: 10000,
            monitorCommands: true
        })

        const client = mongoose.connection.getClient()
        client.on("commandSucceeded", (event) => {
            if (event.duration >= slowDatabaseThreshold) {
                console.warn(`[slow-db] ${event.commandName} ${event.duration}ms`)
            }
        })
        client.on("commandFailed", (event) => {
            if (event.duration >= slowDatabaseThreshold) {
                console.warn(`[slow-db] ${event.commandName} failed after ${event.duration}ms`)
            }
        })

        console.log("MONGODB is connected")
        const server = app.listen(PORT, () => {
            console.log(`server is running on port: ${PORT}`)
        })
        server.on("error", (error) => {
            console.error(`[server] ${error.message}`)
            process.exitCode = 1
            mongoose.disconnect().catch((disconnectError) => {
                console.error(`[mongodb] disconnect failed: ${disconnectError.message}`)
            })
        })
        const shutdown = () => {
            server.close((error) => {
                if (error) {
                    console.error(`[server] shutdown failed: ${error.message}`)
                    process.exitCode = 1
                }
                mongoose.disconnect().catch((disconnectError) => {
                    console.error(`[mongodb] disconnect failed: ${disconnectError.message}`)
                    process.exitCode = 1
                })
            })
        }
        process.once("SIGINT", shutdown)
        process.once("SIGTERM", shutdown)
    } catch (error) {
        console.error(`[startup] Unable to connect to MongoDB: ${error.message}`)
        await mongoose.disconnect().catch((disconnectError) => {
            console.error(`[mongodb] disconnect failed: ${disconnectError.message}`)
        })
        process.exitCode = 1
    }
}

startServer()
