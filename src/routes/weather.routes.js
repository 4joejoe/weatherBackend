import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getHistoricalData, getWeather } from "../controllers/weather.controller.js"
import { cacheMiddleware } from "../middlewares/cache.middleware.js"

const weatherRouter = Router()
const cacheDuration = 60 * 60 * 24 // cache duration for 24hr 
weatherRouter.route("/:location_id").get(verifyJWT,cacheMiddleware(cacheDuration),getWeather)
weatherRouter.route("/history/:location_id/:days").get(verifyJWT,cacheMiddleware(cacheDuration),getHistoricalData)
export {weatherRouter}