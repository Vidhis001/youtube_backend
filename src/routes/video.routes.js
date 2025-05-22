import router, { Router } from "express";
import { getAllVideos,publishAVideo,getVideoById,updateVideo,deleteVideo,togglePublishStatus } from "../controllers/video.controller";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();


router.request(verifyJWT);

router.route("/getVideos").get(getAllVideos)
router.route("/publish").post(
    upload.fields([
        {
            name:'videoFile',
            maxCount:1
        },
        {
            name:'thumbnail', 
            maxCount:1
                
        }
    ]),
    publishAVideo
);
router.route("/:videoId").get(getVideoById)
router.route("/update/:videoId").patch(upload.single("thumbnail"),updateVideo)
router.route("/delete/:videoId").delete(deleteVideo)
router.route("/toggle/publish/:videoId").patch(togglePublishStatus)

export default router;