import { Router } from "express";
import {toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.use(verifyJWT);

router.route("/togglesubs/:channelId").post(toggleSubscription)
router.route("/channel/:channelId").get(getUserChannelSubscribers)
router.route("/getmysubs/:subscriberId").get(getSubscribedChannels)

export default router;