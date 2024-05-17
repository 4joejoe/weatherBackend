import axios from "axios";
import { Location } from "../models/location.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getGeoInfo = async (geo_queries) => {
    const { city,zip,state_code,country_code,limit } = geo_queries

    let url;

    if (zip && country_code) {
        url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},${country_code}&appid=${process.env.WEATHER_API}`
    } else if (city) {
        let locationQuery = city;
        if (state_code) locationQuery += `,${state_code}`;
        if (country_code) locationQuery += `,${country_code}`;
        const limitValue = limit || 1;
        url = `http://api.openweathermap.org/geo/1.0/direct?q=${locationQuery}&limit=${limitValue}&appid=${process.env.WEATHER_API}`;
    }

    const response = await axios.get(url)
    return response.data

}

const registerLocation = async (location_data) => {
    const { zipCode, countryCode } = location_data
    // to register location db all fields are required
    if ([zipCode, countryCode].some((field) => {
        field?.trim()===""
    })) {
        throw new ApiError(400,"All fields are required to create location record")
    }

    const geo_data = await getGeoInfo({zip:zipCode,country_code:countryCode});
    const {zip,name,lat,lon,country} = geo_data;

    const location_id = zip+country
    const newLocation = await Location.create({
        name: name,
        zip_code: zipCode,
        country_code: countryCode,
        location_id: location_id,
        lat: lat,
        lon: lon
    });

    return newLocation
}

const getAllLocation = asyncHandler(async (req, res) => {
    const locations = await Location.find({});
    return res.status(200).json(new ApiResponse(200, locations, "Locations fetched successfully"));
})

const getAllLocationByUser = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.user._id).populate('locations');
    return res.status(200).json(new ApiResponse(200, user.locations, "getting location id"))
})

const setLocation = asyncHandler(async (req, res) => {
    // upon user request based on geo queries
    // get location_id
    // if location_id isn't provided in queries
    // form location_id only if both zip and country_code is provided in queries
    // form location_id using parsed data from getGeoInfo

    // upon getting location_id search db for this location
    // if record found in db then directly add location object to current user by getting current user info 
    // if record not found in db then create new record for this location and also add it to current user
    

    // While adding location zip_code,country_code is required in body
    const { city, zip, state_code, country_code, limit, location_id } = req.body
    
    if (!zip || !country_code) {
        throw new ApiError(400, "Both zip and country_code are required");
    }

    let new_location_id;
    if (!location_id) {
        new_location_id = zip+country_code
    }

    let existedLocation =  await Location.findOne({
        location_id:location_id || new_location_id
    })

    let new_location;
    if (!existedLocation) {
        // new_location = await registerLocation({ zipCode: zip, countryCode: country_code })
        new_location = await registerLocation({zipCode: zip, countryCode: country_code});
        if (new_location) {
            existedLocation = new_location;
        } else {
            throw new Error('Failed to register new location');
        }
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id, 
            { $push: { locations: existedLocation._id } },
            { new: true }
        );
        return res.status(200).json(new ApiResponse(200,updatedUser,"Location successfully added to user"))
    
    } catch (error) {
        throw new ApiError(500,`Something went wrong while adding location to user: ${error}`)
        
    }

    // first search db on location_id if record with location_id is found then set location ref in current user
    // if not the fetch location info using geo
    

    

        

})


const getLocation = asyncHandler(async (req, res) => {
    const location_id = req.params.location_id;

    try {
        const location = await Location.findOne({
            location_id:location_id
        }) 

        return res.status(200).json(new ApiResponse(200,location,"Location found"))
        
    } catch (error) {
        throw new ApiError(400,"Location not found")
    }
})

const updateLocation = asyncHandler(async (req, res) => {
    // it doesn't make sense to update location data since its mostly constants, but however it can be updated for sake of case study requirement
    const location_id = req.params.location_id;
    const update = req.body;

    try {
        const location = await Location.findOneAndUpdate(
            { location_id: location_id },
            update,
            { new: true }
        );

        if (!location) {
            throw new ApiError(400, "Location not found");
        }

        return res.status(200).json(new ApiResponse(200, location, "Location updated successfully"));
    } catch (error) {
        throw new ApiError(400, "Location not found");
    }

})

const deleteLocation = asyncHandler(async(req, res) => {
    const location_id = req.params.location_id;

    try {
        await Location.findOneAndDelete({ location_id: location_id })
        return res.status(204).json(new ApiResponse(204))
    } catch (error) {
        throw new ApiError(500,`Something went wrong: ${error}`)
        
    }
})
export { deleteLocation, getAllLocation, getAllLocationByUser, getLocation, setLocation, updateLocation };
