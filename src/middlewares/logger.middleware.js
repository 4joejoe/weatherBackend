import { asyncHandler } from "../utils/asyncHandler.js";
import { createLogger } from "../utils/logger.js";

const logger = asyncHandler(async (req, res,next) => {
    try{
        createLogger.info(`${req.method} ${req.url}`);
        next()
    } catch (error) {
        throw new Error('An error occurred while logging the request');
    }
})

export {logger}