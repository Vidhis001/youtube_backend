import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { channel } from "diagnostics_channel"
import { throwDeprecation } from "process"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const subscription=await Subscription.find({
        channel:channelId,
        subscriber:req.user._id
    })
    if(!subscription.length){
        const newSubs=await Subscription.create(
            {
                channel:channelId,
                subscriber:req.user._id
            }
        )
        if(!newSubs){
            throw new ApiError(400,"failed to create new subscriber")
        }
    }else{
        await Subscription.findByIdAndDelete(subscription[0]._id)
    }
    return res.status(200).json(
        new ApiResponse(200,subscription,"subscription toggled successfully")
    )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscribers=await Subscription.find({channel:channelId})
    return res.status(200).json(
        new ApiResponse(
            200,
            subscribers.map((sub)=sub.subscriber),
            "subscribers fetched successfully"
        )
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const channels=await Subscription.find({subscriber:subscriberId})
    return res.status(200).json(
        new ApiResponse(
            200,
            channels.map((ch)=ch.channel),
            "subscribed channels fetched successfully"
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}