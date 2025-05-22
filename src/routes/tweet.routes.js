import router, { Router } from "express";
import {createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();

router.use(verifyJWT);
router.route("/create").post(createTweet)
router.route("/usertweets/:userId").get(getUserTweets)
router.route("/update/:tweetId").post(updateTweet)
router.route("/deletet/:tweetId").delete(deleteTweet)

export default router;