import Post from "../models/Post.js"

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "username fullName avatar")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
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

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
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

    res.status(200).json({
      success: true,
      posts,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    })
  }
}

export const togglePostLike = async (req, res) => {
  try {
    const { postId } = req.params
    const userId = req.user.id

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    const isLiked = post.likes.some(likeId => likeId.toString() === userId)

    post.likes = isLiked
      ? post.likes.filter(likeId => likeId.toString() !== userId)
      : [...post.likes, userId]

    await post.save()

    const updatedPost = await Post.findById(postId).populate(
      "author",
      "username fullName avatar",
    )

    res.status(200).json({
      success: true,
      message: isLiked ? "Like removed" : "Post liked",
      post: updatedPost,
    })
  } catch (error) {
    console.error("Toggle like error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to update like",
    })
  }
}
