import { Router } from "express";
import {createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist} from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/create").post(verifyJWT,createPlaylist)
router.route("/getuserpl/:userId").get(getUserPlaylists)
router.route("/getplaylist/:playlistId").get(getPlaylistById)
router.route("/:playlistId/video/:videoId").post(addVideoToPlaylist)
router.route("removevideo/:playlistId/video/:videoId").delete(removeVideoFromPlaylist)
router.route("/deleteplaylist/:playlistId").delete(deletePlaylist)
router.route("/update/:playlistId").put(updatePlaylist)

export default router;