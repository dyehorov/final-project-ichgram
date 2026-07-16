import express from "express"
import {
  editProfile,
  getUserProfile,
  searchUsers,
  toggleFollowUser,
} from "../controllers/userController.js"
import authMiddleware from "../middlewares/authMiddleware.js"
import { uploadAvatarMiddleware } from "../middlewares/uploadImageMiddleware.js"

const router = express.Router()

router.get("/search/users", authMiddleware, searchUsers)
router.get("/:userId", authMiddleware, getUserProfile)
router.patch("/:userId/follow", authMiddleware, toggleFollowUser)

router.patch(
  "/:userId/edit-profile",
  authMiddleware,
  uploadAvatarMiddleware,
  editProfile,
)

export default router
