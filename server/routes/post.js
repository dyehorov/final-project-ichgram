import express from "express"
import {
  createPost,
  getUserPosts,
  getAllPosts,
} from "../controllers/postController.js"
import { togglePostLike } from "../controllers/likeController.js"
import {
  createComment,
  getPostComments,
} from "../controllers/commentController.js"
import authMiddleware from "../middlewares/authMiddleware.js"
import { uploadPostImageMiddleware } from "../middlewares/uploadImageMiddleware.js"

const router = express.Router()

router.get("/", getAllPosts)

router.get("/user/:userId", authMiddleware, getUserPosts)

router.patch("/:postId/like", authMiddleware, togglePostLike)
router.get("/:postId/comments", getPostComments)
router.post("/:postId/comments", authMiddleware, createComment)

router.post(
  "/create-post",
  authMiddleware,
  uploadPostImageMiddleware,
  createPost,
)

export default router
