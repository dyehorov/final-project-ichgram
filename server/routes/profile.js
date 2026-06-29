import express from "express"
import {
  editProfile,
  getUserProfile,
  toggleFollowUser,
} from "../controllers/userController.js"
import authMiddleware from "../middlewares/authMiddleware.js"
import { uploadAvatarMiddleware } from "../middlewares/uploadPostImageMiddleware.js"

const router = express.Router()

router.get("/:userId", authMiddleware, getUserProfile)
router.patch("/:userId/follow", authMiddleware, toggleFollowUser)

router.patch(
  "/:userId/edit-profile",
  authMiddleware,
  uploadAvatarMiddleware,
  editProfile,
)

export default router
