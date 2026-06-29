import express from "express"
import {
  createPost,
  getUserPosts,
  getAllPosts,
  togglePostLike,
} from "../controllers/postController.js"
import authMiddleware from "../middlewares/authMiddleware.js"
import { uploadPostImageMiddleware } from "../middlewares/uploadImageMiddleware.js"

const router = express.Router()

router.get("/", getAllPosts)

router.get("/user/:userId", authMiddleware, getUserPosts)

router.patch("/:postId/like", authMiddleware, togglePostLike)

router.post(
  "/create-post",
  authMiddleware,
  uploadPostImageMiddleware,
  createPost,
)

export default router
