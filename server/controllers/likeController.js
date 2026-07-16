import Like from "../models/Like.js"
import Comment from "../models/Comment.js"
import Post from "../models/Post.js"

export async function togglePostLike(req, res) {
  try {
    const { postId } = req.params
    const userId = String(req.user?.id || req.user?._id || "")

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    const existingLike = await Like.findOne({ post: postId, user: userId })

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id)
    } else {
      await Like.create({ post: postId, user: userId })
    }

    const updatedPost = await Post.findById(postId).populate(
      "author",
      "username fullName avatar",
    )
    const likes = await Like.find({ post: postId }).select("user")
    const comments = await Comment.find({ post: postId }).select("_id")
    const postWithLikes = {
      ...updatedPost.toObject(),
      likes: likes.map(like => like.user),
      comments: comments.map(comment => comment._id),
    }

    res.status(200).json({
      success: true,
      message: existingLike ? "Like removed" : "Post liked",
      post: postWithLikes,
    })
  } catch (error) {
    console.error("Toggle like error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to update like",
    })
  }
}
