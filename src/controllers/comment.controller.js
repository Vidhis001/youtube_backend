import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const skip = (page-1)*limit

    const comments = await Comment.find({video: videoId})
   .sort({createdAt: -1})
   .skip(skip)
   .limit(limit)

    return res.json(new ApiResponse(200,comments,"Comments fetched successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {commenttext}=req.body
    const {videoId} = req.params
    if(!commenttext){
        throw new ApiError(200,"comment not found")
    }
    const createNewComment={
        content:commenttext,
        video:videoId,
        owner:req.user._id
    }
    if(!createNewComment){
        throw new ApiError(400,"comment addition failed")
    }
    return res.status(200).json(
        new ApiResponse(200,createNewComment,"new comment created successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId}=req.params;
    const {content}=req.body;
    const commment=await Comment.findById(commentId)
    if(commment){
        Comment.content=content
    }
    return res.status(200).json(
        new ApiResponse(200,commentId,"comment updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}=req.params
    const comment=await Comment.findByIdAndDelete(commentId)
    if(!comment){
        throw new ApiError(404,"Comment not found")
    }
    return res.status(200).json(
        new ApiResponse(200,null,"comment deleted successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }