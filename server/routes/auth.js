import express from "express"
import {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
} from "../controllers/userController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

// POST /auth/register - register a new user
router.post("/register", registerUser)

// POST /auth/login - login a user
router.post("/login", loginUser)
router.post("/forgot-password", forgotPassword)
router.get("/me", authMiddleware, getCurrentUser)

export default router
