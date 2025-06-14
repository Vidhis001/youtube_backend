import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const like=await Like.findOne({userId:req.user._id,video:videoId})
    if(like){
        try {
            await Like.findByIdAndDelete(like._id)
        } catch (error) {
            throw new ApiError(400,"failed to delete like")
        }
    }
    if(!like){
        try {
            await Like.create({userId:req.user._id,video:videoId})
        } catch (error) {
            throw new ApiError(400,"failed to create like")
        }
    }
    return res.status(200).json(
        new ApiResponse(200,null,"like toggled successfully")
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const like=await Like.findOne({userId:req.user._id,comment:commentId})
    if(like){
        try {
            await Like.findByIdAndDelete(like._id)
        } catch (error) {
            throw new ApiError(400,"failed to delete like")
        }
    }
    if(!like){
        try {
            await Like.create({userId:req.user._id,comment:commentId})
        } catch (error) {
            throw new ApiError(400,"failed to create like")
        }
    }
    return res.status(200).json(
        new ApiResponse(200,null,"like toggled successfully")
    )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const like=await Like.findOne({userId:req.user._id,tweet:tweetId})
    if(like){
        try {
            await Like.findByIdAndDelete(like._id)
        } catch (error) {
            throw new ApiError(400,"failed to delete like")
        }
    }
    if(!like){
        try {
            await Like.create({userId:req.user._id,tweet:tweetId})
        } catch (error) {
            throw new ApiError(400,"failed to create like")
        }
    }
    return res.status(200).json(
        new ApiResponse(200,null,"like toggled successfully")
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos=await Like.find({
        user:req.user._id,
        video:{$ne:null},
    })
    return res.status(200).json(
        new ApiResponse(200,likedVideos,"liked videos fetched successfully")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}