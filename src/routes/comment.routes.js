import router, { Router } from "express";
import { getVideoComments, 
    addComment, 
    updateComment,
     deleteComment} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();

router.use(verifyJWT);

router.route("/getcomments/:videoId").get(getVideoComments)
router.route("/add/:videoId").post(addComment)
router.route("/:commentId").delete(deleteComment)
router.route("/:commentId").post(updateComment)


export default router;