import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from "./routes/user.routes.js"
import { locationRouter } from "./routes/location.routes.js"
import { weatherRouter } from "./routes/weather.routes.js"
import { limiter } from "./middlewares/rate_limter.middleware.js"
import { logger } from "./middlewares/logger.middleware.js"

console.log("Express app created")
const app = express()
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())

app.use(logger)
// routes import
app.use("/api/v1/users",limiter,userRouter)
app.use("/api/v1/location",limiter,locationRouter)
app.use("/api/v1/weather",limiter,weatherRouter)
export {app}