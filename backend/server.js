const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const authRouter = require("./routers/auth.route")
const wordsRoute = require("./routers/words.route");

const app = express()

const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: true,
    credentials: true
}));
app.use("/api/auth", authRouter)
app.use("/api/words", wordsRoute);

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("MONGODB is connected")

        app.listen(PORT, () => {
            console.log("server is running on port: ", PORT)
        })
    })
