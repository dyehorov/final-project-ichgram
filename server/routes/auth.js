import express from "express"
import {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
} from "../controllers/userController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/register", registerUser)

router.post("/login", loginUser)
router.post("/forgot-password", forgotPassword)
router.get("/me", authMiddleware, getCurrentUser)

export default router
