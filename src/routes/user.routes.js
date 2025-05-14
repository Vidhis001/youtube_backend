import { Router } from "express"; 
import { changeCurrPassword, getCurrUser, getUserchannelProfile, getWatchHistory, loginuser, logoutUser, refreshAccessToken, registeruser, updateAccountDetails, updateUserAvatar, updateUsercoverImage } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name:'avatar',
            maxCount:1
        },
        {
            name:'coverImage', 
            maxCount:1
                
        }
    ]),
    registeruser
);

router.route("/login").post(loginuser)

//secure routes
router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT,changeCurrPassword)

router.route("/current-user").post(verifyJWT,getCurrUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)

router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)

router.route("/cover-image").patch(verifyJWT,upload.single("/coverImage"),updateUsercoverImage)
router.route("/c/:username").get(verifyJWT,getUserchannelProfile)

router.route("/history").get(verifyJWT,getWatchHistory)








export  default router