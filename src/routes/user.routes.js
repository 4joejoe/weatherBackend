import { Router } from "express";
import { loginUser, logoutUser, registerUser, getNewToken } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.route("/register").post(registerUser)
userRouter.route("/login").post(loginUser)

// secure routes

userRouter.route("/logout").post(verifyJWT, logoutUser)
userRouter.route("/refresh-token").post(getNewToken)
export default userRouter