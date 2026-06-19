import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../models/User.js"

dotenv.config()
const JWT_TOKEN = process.env.JWT_TOKEN

const router = express.Router()

// POST /auth/register - register a new user
router.post("/register", async (req, res) => {
  try {
    const { email, fullName, username, password } = req.body

    if (!email || !fullName || !username || !password) {
      return res.status(400).json({ message: "All credentials required" })
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
    res.status(500).json({ success: false, message: "Internal server error" })
  }
})

// POST /auth/login - login a user
router.post("/login", async (req, res) => {
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
      { expiresIn: "1h" },
    )

    res
      .status(201)
      .json({ success: true, message: "Successfully logged in", token })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ success: false, message: "Login error" })
  }
})

export default router
