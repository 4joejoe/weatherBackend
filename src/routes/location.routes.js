import { Router } from "express";
import {getAllLocation, getAllLocationByUser, setLocation,getLocation,updateLocation,deleteLocation } from "../controllers/location.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { cacheMiddleware } from "../middlewares/cache.middleware.js";

const locationRouter = Router()

locationRouter.route("/").get(getAllLocation)
locationRouter.route("/:location_id").get(getLocation)
locationRouter.route("/user-locations").get(verifyJWT,getAllLocationByUser)
locationRouter.route("/").post(verifyJWT,setLocation)
locationRouter.route("/:location_id").put(verifyJWT,updateLocation)
locationRouter.route("/:location_id").delete(verifyJWT,deleteLocation)
export {locationRouter}