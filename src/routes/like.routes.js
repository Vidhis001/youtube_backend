import { Router } from "express";
import { toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router=Router();
router.use(verifyJWT);


router.route("/getlikedvideos").get(getLikedVideos)
router.route("/toggle/tweelike/:tweetId").post(toggleTweetLike)
router.route("/toggle/viddeolike/:videoId").post(toggleVideoLike)
router.route("/toggle/commentlike/:commentId").post(toggleCommentLike)




export default router;






