import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {user, user as User} from "../models/user.model.js"
import {uploadResult} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"


const genAccAndRefToken=async(userId)=>{
    try {
        const user=await User.findById(userId)
        const accesToken=user.genAccessToken()
       const refreshToken= user.genRefreshToken()

       user.refreshToken=refreshToken
      await  user.save({validateBeforeSave:false})

      return {accesToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"something went wrong while gen access and refresh token")
    } 
}

const registeruser=asyncHandler(async(req,res)=>{
    //steps for user registeration 
    //get user details from frontend
    //validation-not empty
    //check if user already exists username email
    //check for images
    //check for avaatr
    //upload them to cloudinary,avatar 
    //create user object-create entry in db
    //remove password and refresh token field from res
    //check for user creation
    //return res 
    const {fullname,email,username,password}=req.body;
    //console.log("email:",email);

    if(
        [fullname,email,username,password].some((field )=>
        field?.trim()===""
        )
    ){
        throw new ApiError(400,"all fields is required");
    }
    const existedUser= await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"username or email already exists");
    }
    //console.log(req.files);
    const avatarLocalPath=req.files?.avatar?.[0]?.path;
    //const coverImageLocalPath=req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) {
        coverImageLocalPath=req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar is required");
    }

   const avatar= await uploadResult(avatarLocalPath)
   const coverImage= await uploadResult(coverImageLocalPath)

   if(!avatar){
    throw new ApiError(402,"avatar is required");
   }

   const newUser= await User.create({
    fullname,
    avatar:avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
   })
   
   const createdUser= await User.findById(newUser._id).select(
    "-password -refreshToken"
   )
   if(!createdUser){
    throw new ApiError(500,"failed to create user");
   }

   return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered succesfully")
   )

})

const loginuser=asyncHandler(async(req,res)=>{
   //req body->data
   //username or email
   //find the user
   //password check
   //acess and refresh token
   //send cookies

   const {email,username,password}=req.body
   if (!(username || email)) {
       throw new ApiError(400,"username or email is required")

   }
  const user=await User.findOne({
    $or:[{username},{email}]
   })
   if(!user){
    throw new ApiError(404,"user not found")
   }
   const isPassValid=await user.isPasswordCorrect(password)
   if(!isPassValid){
    throw new ApiError(401,"invalid user credentials")
   }

    const {accesToken,refreshToken}=await genAccAndRefToken(user._id)
    
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200).cookie("accessToken",accesToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
            {
                user:loggedInUser,accesToken,refreshToken
            },
            "user logged in successfully"
        )
    )
})

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:1
            }
        },{
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged out"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }
    
    try {
        const decodedToken=jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user=await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"invalid refresh token")
        }
    
        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(401,"refresh token is expired or used")
        }
    
        const options={
            httpOnly:true,
            secure:true
        }
       const {accesToken,newRefreshToken}=await genAccAndRefToken(user._id)
       return res.status(200)
       .cookie("accessToken",accesToken,options)
       .cookie("refreshToken",newRefreshToken,options)
       .json(
        new ApiResponse(
            200,
            {accesToken,refreshToken:newRefreshToken},
            "access token refreshed successfully"
        )
       )
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid refresh token")
    }
})

const changeCurrPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body
    const user=await User.findById(req.user?._id)
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"incorrect old password")
    }

   user.password=newPassword
   await user.save({validateBeforeSave:false})

   return res.status(200)
   .json(new ApiResponse(200,{},"password change successfully"))

})

const getCurrUser=asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(200,req.user,"current user fetched successfully")
})

const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullname,email} = req.body
    if(!fullname || !email){
        throw new ApiError(400,"all fields are required")
    }
    User.findByIdAndUpdate(req.user._id,
        {
           $set:{
            fullname,
            email:email,
           }
        },
        {new:true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"account details updated successfully"))
})

const updateUserAvatar=asyncHandler(async(req,res)=>{
    const avatarLocalPath=req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400,"file not found")
    }
    const avatar=await uploadResult(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(400,"error while uploading on avatar")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"avatarimage updated successfully"))
})

const updateUsercoverImage=asyncHandler(async(req,res)=>{
    const coverImageLocalPath=req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400,"file not found")
    }
    const coverImage=await uploadResult(coverImageLocalPath)
    if(!avatar.url){
        throw new ApiError(400,"error while uploading on cover")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new:true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"coverimage updated successfully"))
})
//todo delete avatar

const getUserchannelProfile=asyncHandler(async(req,res)=>{
    const {username}=req.params
    if(!username?.trim()){
        throw new ApiError(400,"username is missing")
    }
    const channel=await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscribers",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribers",
                },
                channelSubscribedToCount:{
                    $size:"$subscribedTo",
                },
                isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                fullname:1,
                username:1,
                subscribersCount:1,
                channelSubscribedToCount:1,
                isSubscribed:1,
                avatar:1,
                coverImage:1,
                email:1
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404,"channel does not exist")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,channel[0],"user channel fetched successfully")
    )

})


const getWatchHistory=asyncHandler(async(req,res)=>{
    const user=await User.aggregate(
        [
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                $lookup:{
                    from:"videos",
                    localField:"watchHistory",
                    foreignField:"_id",
                    as:"watchHistory",
                    pipeline:[
                        {
                            $lookup:{
                                from:"users",
                                localField:"owner",
                                foreignField:"_id",
                                as:"owner",
                                pipeline:[
                                    {
                                        $project:{
                                            fullname:1,
                                            username:1,
                                            avatar:1,
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields:{
                                owner:{
                                    $first:"$owner"
                                }
                            }
                        }
                    ]
                }
            }
        ])

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "watch history fetched successfully"
            )
        )
})


export {registeruser,loginuser,
    logoutUser,refreshAccessToken
    ,changeCurrPassword,getCurrUser,
    updateAccountDetails,
    updateUserAvatar,updateUsercoverImage,getUserchannelProfile,
    getWatchHistory
}