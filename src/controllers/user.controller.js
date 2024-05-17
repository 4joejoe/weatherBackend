import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const generateRefreshAndAccessToken = async (userID) => {
    try {
        const user = await User.findById(userID)
        if (!user) {
            throw new ApiError(404,"User not found")
        }
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        
        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {username,email,password} = req.body

    if ([username, email, password].some((field) => {
        field?.trim()===""
    })) {
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })

    if (existedUser) {
        console.log(existedUser)
        throw new ApiError(409,"User with given username or email already exists")
    }


    const user = await User.create({
        username,
        email,
        password
    })

    const isUserCreated = await User.findById(user._id)
    .select("-password -refreshToken")
    
    if (!isUserCreated) {
        throw new ApiError(500,"Something went wrong while creating user")
    }

    return res.status(201).json(new ApiResponse(201,isUserCreated,"User registered successfully"))
    
    
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    
    if (!(username || email)) {
        throw new ApiError(400, "Username or Email is required")
    }

    const user = await User.findOne({
        $or:[{username},{email}]
    })

    if (!user) {
        throw new ApiError(404,"User not found")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401,"Invalid Password")
    }

    const {accessToken,refreshToken } = await generateRefreshAndAccessToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    } 

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                    user:loggedInUser,accessToken,refreshToken
            },
                "User logged in successfully"
            )
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken:undefined
            }
        }
    )

    const options = {
        httpOnly: true,
        secure:true
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"User logged out"))
})

const getNewToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }
    console.log("Refresh Token received successfully")
    try {
        const decoded_token = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decoded_token?._id)
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401,"Refresh token is expired")
        }
    
        const options = {
            httpOnly: true,
            secure:true
        }
    
        const  {accessToken,refreshToken} = await generateRefreshAndAccessToken(user._id)
        return res
        .status(200)
        .cookie("accessToken", accessToken,options)
        .cookie("refreshToken", refreshToken,options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken },
                "Access token refreshed"
                
        )
    )
    } catch (error) {
        throw new ApiError(401,"Invalid refresh token")
    }
})
export {registerUser,loginUser,logoutUser,getNewToken}