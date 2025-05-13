import { Router } from "express"; 
import { loginuser, logoutUser, refreshAccessToken, registeruser } from "../controllers/user.controller.js";
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
export  default router