import axios from "axios";
import { Location } from "../models/location.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { createLogger } from "../utils/logger.js";

const getWeather = asyncHandler(async (req, res) => {
    const location_id = req.params.location_id

    
    try {
        const location = await Location.findOne({
            location_id:location_id
        })
    
        // console.log(location)
        // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location['lat']}&lon=${location['lon']}&appid=${process.env.WEATHER_API}
`

        console.log(url)
        const safeUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${location['lat']}&lon=${location['lon']}`;
        createLogger.info(`Making a request to ${safeUrl}`)
        const response = await axios.get(url)
        createLogger.info(`Received a response with status code ${response.status}`);

        return res.status(200).json(new ApiResponse(200,response.data,"weather forecast data fetched successfully"))
    } catch (error) {
        createLogger.error(`An error occurred while fetching weather data: ${error}`);

        throw new ApiError(500,`Something went wrong while fetching weather data ${error}`)
    }
})

const getHistoricalData = asyncHandler(async (req, res) => {
    const location_id = req.params.location_id;
    const days = req.params.days;

    try {
        const location = await Location.findOne({
            location_id: location_id
        });

        // current time in unix timestamp format
        const end = Math.floor(Date.now() / 1000); 
        // time days ago in Unix timestamp format
        const start = end - days * 24 * 60 * 60;

        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location['lat']},${location['lon']}/${start}/${end}?key=${process.env.VISUAL_CROSSING}`
        console.log(url)
        const response = await axios.get(url);
        console.log(response.data)
        return res.status(200).json(new ApiResponse(200, response.data, "Historical weather data fetched successfully"));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while fetching historical weather data: ${error}`);
    }
})
export {getWeather,getHistoricalData}