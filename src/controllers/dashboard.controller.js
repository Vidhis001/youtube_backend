import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
   const {channelId}=req.params
   let subscriberCount=0;
   let videos;
   try {
    videos = await Video.find({owner : channelId});
        subscriberCount = await Subscription.countDocuments({channel : channelId});
   } catch (error) {
    throw new ApiError(500,"Failed to fetch stats")
   }
   const totalVideos = videos.length;
   let totalVideoViews = 0;
    videos.map((video)=>{
        totalVideoViews += video.views
    })
     return res.status(200).json(
        new ApiResponse(200,{totalVideos, subscriberCount, totalVideoViews},"Channel stats fetched successfully")  
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId}=req.params;
    let videos;
    try {
        videos=await Video.find({owner:channelId});
    } catch (error) {
        throw new ApiError(500,"Failed to fetch videos")
    }
    return res.status(200)
   .json( new ApiResponse(200,videos,"Videos fetched successfully") )
})

export {
    getChannelStats, 
    getChannelVideos
    }