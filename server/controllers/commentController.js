import Comment from "../models/Comment.js"
import Post from "../models/Post.js"

export async function getPostComments(req, res) {
  try {
    const { postId } = req.params

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    const comments = await Comment.find({ post: postId })
      .populate("author", "username fullName avatar")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      comments,
    })
  } catch (error) {
    console.error("Get comments error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    })
  }
}

export async function createComment(req, res) {
  try {
    const { postId } = req.params
    const { text } = req.body

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      })
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user.id,
      text: text.trim(),
    })

    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "username fullName avatar",
    )

    res.status(201).json({
      success: true,
      comment: populatedComment,
    })
  } catch (error) {
    console.error("Create comment error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to create comment",
    })
  }
}
