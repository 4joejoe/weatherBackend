import mongoose from "mongoose";

const locationSchema = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    zip_code: {
        type: String,
        required:true
    },
    country_code: {
        type: String,
        required: true,
    },
    location_id: {
        type: String,
        required: true,
        unique:true
    },
    lat: {
        type: String,
        required: true,
        unique:true
    },
    lon: {
        type: String,
        required: true,
        unique:true
    }

}, { timestamps: true })

export const Location = mongoose.model("Location",locationSchema)