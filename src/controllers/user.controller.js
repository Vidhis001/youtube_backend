import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadResult} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registeruser=asyncHandler=>(async(req,res)=>{
    const {fullname,email,username,password}=req.body;
    console.log("email:",email);

    if(
        [fullname,email,username,password].some((field )=>
        field?.trim()===""
        )
    ){
        throw new ApiError(400,"all fields is required");
    }
    const existedUser=User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"username or email already exists");
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar is required");
    }

   const avatar= await uploadResult(avatarLocalPath)
   const coverImage= await uploadResult(coverImageLocalPath)

   if(!avatar){
    throw new ApiError(400,"avatar is required");
   }

   const user= await User.create({
    fullname,
    avatar:avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username:toLowerCase()
   })
   
   const createdUser= await User.findById(user._id).select(
    "-password -refreshToken"
   )
   if(!createdUser){
    throw new ApiError(500,"failed to create user");
   }

   return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered succesfully")
   )

})

export {registeruser}