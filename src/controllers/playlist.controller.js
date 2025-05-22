import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if(!name || !description){
        throw new ApiError(400,"name and description are required")
    }
    //TODO: create playlist
    if(!name){
        throw new ApiError(400,"name is required")
    }
    const playlist={
        name,
        description,
        owner:req.user._id,
    }
    if(!playlist){
        throw new ApiError(400,"failed to create a playlist")
    }
    return res.status(200)
    .json(
        new ApiResponse(200,playlist,"playlist created successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"invalid user id")
    }
    const playlist=await Playlist.find({owner:userId})
    
    if (!playlists) {
        throw new ApiError(404, "No playlists found for this user");
    }

    return res.json(
        new ApiResponse(200, playlists, "Playlists fetched successfully")
    );
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"invalid playlist id")
    }
    const playlist=await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(400,"playlist not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,playlist,"playlist found")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,"invalid playlist or video id")
    }
    const playlist=await Playlist.findByIdAndUpdate(playlistId,
        {
            $push:{videos:videoId},
        },
        {new:true}
    )
    if(!playlist){
        throw new ApiError(400,"adding video to playlist failed")
    }
    return res.status(200).json(
        new ApiResponse(200,playlist,"video added to playlist succesfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,"invalid playlist or video id")
    }
    const playlist=await Playlist.findByIdAndDelete(playlistId,
        {
            $pull:{videos:videoId},
        },
        {new:true}
    )
    if(!playlist){
        throw new ApiError(400,"deleting video from playlist failed")
    }
    return res.status(200).json(
        new ApiResponse(200,playlist,"video deleted from playlist succesfully")
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"invalid playlist or id")
    }
    const playlist=await Playlist.findByIdAndDelete(playlistId)
    if(!playlist){
        throw new ApiError(400,"deletion of playlist failed")
    }
     return res.status(200).json(
        new ApiResponse(200,playlist,"playlist deleted succesfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"invalid playlist or id")
    }
    if (!name || !description) {
        throw new ApiError(400, "name or description are required");
    }
    const playlist=await Playlist.findByIdAndUpdate(playlistId,
        {
            name,
            description,
        },
        {new:true}
    )
    if(!playlist){
        throw new ApiError(400,"failed to update the playlist")
    }
     return res.status(200).json(
        new ApiResponse(200,playlist,"playlist updated succesfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}