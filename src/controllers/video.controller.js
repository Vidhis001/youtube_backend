import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadResult,deleteFromCloudinary,extractPublicId} from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const sortOrder = sortType === 'asc' ? 1 : -1;

    const matchStage = {};

    if (query) {
        matchStage.$or = [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ];
    }

    if (userId) {
        matchStage.user = userId;
    }

    const pipeline = [
        { $match: matchStage },
        {
            $sort: {
                [sortBy]: sortOrder
            }
        },
        {
            $skip: (pageNumber - 1) * limitNumber
        },
        {
            $limit: limitNumber
        }
    ];

    const countPipeline = [
        { $match: matchStage },
        { $count: 'total' }
    ];

    const [videos, totalResult] = await Promise.all([
        Video.aggregate(pipeline),
        Video.aggregate(countPipeline)
    ]);

    const total = totalResult[0]?.total || 0;

    res.status(200).json({
        total,
        page: pageNumber,
        limit: limitNumber,
        videos
    });
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const videoLocalPath=req.file?.path;
    if(!videoLocalPath){
        throw new ApiError(400,"file not found");
    }
      const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
    if (!uploadedVideo?.url) {
        throw new ApiError(400, "Error while uploading the video");
    }

    // Create a new video document
    const newVideo = await Video.create({
        title,
        description,
        video: uploadedVideo.url,
        owner: req.user._id // assuming you have authentication middleware setting this
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newVideo, "Video published successfully"));
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" }
            }
        }
    ]);

    if (!video || video.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "Video not found"));
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            video[0],
            "Video fetched successfully"
        )
    );
});


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {title,description}=req.body;
    const thumbnailLocalPath=req.file?.path;
    //find the video

    const video=await Video.findById(videoId);
    if(!video){
        throw new ApiError(400,"file not found");
    }
    //update thumbnail if provided
    if(thumbnailLocalPath){
        const uploadedThumbnail=await uploadResult(thumbnailLocalPath)
        if(!uploadedThumbnail?.url){
            throw new ApiError(400,"error uploading thumbnail")
        }
        video.thumbnail=uploadedThumbnail.url;
    }
    if(title) video.title=title;
    if(description) video.description=description;

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const video=await Video.findById(videoId);
    if(!video){
        throw new ApiError(400,"file not found");
    }
    const videoPublicId=extractPublicId(video.video)

    if (videoPublicId) {
        await deleteFromCloudinary(videoPublicId); // your helper function to delete from Cloudinary
    }

    // Step 4: Delete from MongoDB
    await Video.findByIdAndDelete(videoId);

    return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            `Video ${video.isPublished ? "published" : "unpublished"} successfully`
        )
    );
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}