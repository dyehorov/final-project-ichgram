import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
const JWT_TOKEN = process.env.JWT_TOKEN

// POST /auth/register - register a new user
export const registerUser = async (req, res) => {
  try {
    const { email, fullName, username, password } = req.body

    if (!email || !fullName || !username || !password) {
      return res.status(400).json({ message: "All credentials required" })
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email is already in use"
            : "Username is already taken",
      })
    }

    const newUser = new User({
      email,
      fullName,
      username,
      password: await bcrypt.hash(password, 10),
    })

    await newUser.save()

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

// POST /auth/login - login a user
export const loginUser = async (req, res) => {
  try {
    const { login, password } = req.body

    if (!login || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Credentials are required" })
    }

    const user = await User.findOne({
      $or: [{ username: login }, { email: login }],
    })

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" })
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      JWT_TOKEN,
      { expiresIn: "24h" },
    )

    const { password: _, ...safeUser } = user.toObject()

    res.status(200).json({
      success: true,
      token,
      user: safeUser,
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ success: false, message: "Login error" })
  }
}

// POST /auth/forgot-password - reset password by email
export const forgotPassword = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must have at least have 8 characters",
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email was not found",
      })
    }

    user.password = await bcrypt.hash(password, 10)
    await user.save()

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("Forgot password error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
    })
  }
}

// GET /auth/me - get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean()

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Get current user error:", error)

    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// GET /profile/search/users?query=...
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.query?.trim()

    if (!query) {
      return res.status(200).json({
        success: true,
        users: [],
      })
    }

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

    const users = await User.find({
      $or: [
        { username: { $regex: escapedQuery, $options: "i" } },
        { fullName: { $regex: escapedQuery, $options: "i" } },
      ],
    })
      .select("_id username fullName avatar")
      .sort({ username: 1 })
      .limit(20)
      .lean()

    res.status(200).json({
      success: true,
      users,
    })
  } catch (error) {
    console.error("Search users error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to search users",
    })
  }
}

// GET /profile/:userId - get user profile by id
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-password")
      .lean()

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Get user profile error:", error)

    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// PATCH /profile/:userId/follow - follow or unfollow a user
export const toggleFollowUser = async (req, res) => {
  try {
    const currentUserId = req.user.id
    const targetUserId = req.params.userId

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      })
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(targetUserId),
    ])

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const isFollowing = currentUser.following.some(
      followedUserId => followedUserId.toString() === targetUserId,
    )

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        followedUserId => followedUserId.toString() !== targetUserId,
      )
      targetUser.followers = targetUser.followers.filter(
        followerId => followerId.toString() !== currentUserId,
      )
    } else {
      currentUser.following.push(targetUserId)
      targetUser.followers.push(currentUserId)
    }

    await Promise.all([currentUser.save(), targetUser.save()])

    const [updatedCurrentUser, updatedTargetUser] = await Promise.all([
      User.findById(currentUserId).select("-password"),
      User.findById(targetUserId).select("-password"),
    ])

    res.status(200).json({
      success: true,
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
      currentUser: updatedCurrentUser,
      targetUser: updatedTargetUser,
    })
  } catch (error) {
    console.error("Toggle follow error:", error)

    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// PATCH /profile/:userId/edit-profile - edit user profile
export const editProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { username, website, bio } = req.body

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      })
    }

    if (bio && bio.length > 150) {
      return res.status(400).json({
        success: false,
        message: "Bio must be less than 150 characters",
      })
    }

    const existingUser = await User.findOne({
      username,
      _id: { $ne: userId },
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username is already taken",
      })
    }

    const updateData = {
      username,
      website,
      bio,
    }

    if (req.file) {
      updateData.avatar = `/uploads/avatars/${req.file.filename}`
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password")

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Edit profile error:", error)

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
