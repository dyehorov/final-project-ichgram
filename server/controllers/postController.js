import Post from "../models/Post.js"
import Like from "../models/Like.js"
import Comment from "../models/Comment.js"

async function formatPost(post) {
  const likes = await Like.find({ post: post._id }).select("user")
  const comments = await Comment.find({ post: post._id }).select("_id")

  return {
    ...post.toObject(),
    likes: likes.map(like => like.user),
    comments: comments.map(comment => comment._id),
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "username fullName avatar")
      .sort({ createdAt: -1 })
    const formattedPosts = await Promise.all(posts.map(formatPost))

    res.status(200).json({
      success: true,
      count: formattedPosts.length,
      posts: formattedPosts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const createPost = async (req, res) => {
  try {
    const { caption } = req.body

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      })
    }

    const post = new Post({
      author: req.user.id,
      image: `/uploads/posts/${req.file.filename}`,
      caption,
    })

    await post.save()

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "username fullName avatar",
    )
    const formattedPost = await formatPost(populatedPost)

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: formattedPost,
    })
  } catch (error) {
    console.error("Create post error:", error)

    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username avatar")
      .sort({ createdAt: -1 })
    const formattedPosts = await Promise.all(posts.map(formatPost))

    res.status(200).json({
      success: true,
      posts: formattedPosts,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    })
  }
}
