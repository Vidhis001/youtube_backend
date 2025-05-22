import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {tweetcontent}=req.body
    if(!tweetcontent){
        throw new ApiError(400,"tweet not found")
    }
    const createdTweet={
        content:tweetcontent,
        owner:req.user._id
    }
    if(!createdTweet){
        throw new ApiError(400,"unable to create a tweet")
    }
    return res.status(200).json(
        new ApiResponse(200,null,"tweet created successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId}=req.params
    const tweets=await Tweet.find({owner:userId})
    if(!tweets){
        throw new ApiError(400,"tweets not found")
    }
    return res.status(200).json(
        new ApiResponse(200,"tweets fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetcontent}=req.body
    const {tweetId}=req.params
    const updatedTweet=await Tweet.findByIdAndUpdate(tweetId, {content: tweetText}, {new: true})
    if(!updateTweet){
        throw new ApiError(400,"error while updating the tweet")
    }
    return res.status(200).json(
        new ApiResponse(200,null,"tweet updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params
    const deletedtweet=await Tweet.findByIdAndDelete(tweetId)
    if(!deletedtweet){
        throw new ApiError(400,"error while deleting the tweet")
    }
    return res.status(200).json(
        new ApiResponse(200,null,"tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}