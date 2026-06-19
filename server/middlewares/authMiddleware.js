import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized! No token provided" })

  const token = authHeader.split(" ")[1]

  jwt.verify(token, process.env.JWT_TOKEN, (err, data) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Forbidden!" })
    }

    req.user = data.id
    next()
  })
}
