import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import {user as User} from "../models/user.model.js"

export const verifyJWT=asyncHandler(async(req , _ ,next)=>{
   try {
    const token= req.cookies?.accessToken || 
    req.header("authorization")?.replace("Bearer","")

    if(!token){
        throw new ApiError(401,"unauthorized request")
    }
 
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const authuser=await User.findById(decodedToken?._id).select("-password -refreshToken")

   if(!authuser){
    throw new ApiError(401,"invalid access token")
   }

   req.user=authuser;
   next()
   } catch (error) {
    throw new ApiError(401,error?.message || "invalid access token")
   }

})