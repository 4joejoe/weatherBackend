import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true
    },
    password: {
        type: String,
        required: true
    },
    locations: {
        type:[String]
    }

}, { timestamps: true })

export const User = mongoose.model("User",userSchema)