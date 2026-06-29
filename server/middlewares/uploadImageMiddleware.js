import multer from "multer"
import { uploadPostImage } from "./uploadPostImage.js"
import { uploadAvatarImage } from "./uploadAvatarImage.js"

function handleUpload(uploader, fieldName, req, res, next) {
  uploader.single(fieldName)(req, res, error => {
    if (!error) {
      next()
      return
    }

    if (
      error instanceof multer.MulterError &&
      error.code === "LIMIT_FILE_SIZE"
    ) {
      return res.status(400).json({
        success: false,
        message: "Image must be smaller than 5MB",
      })
    }

    if (error.message === "Only images allowed") {
      return res.status(400).json({
        success: false,
        message: error.message,
      })
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
    })
  })
}

export function uploadPostImageMiddleware(req, res, next) {
  handleUpload(uploadPostImage, "image", req, res, next)
}

export function uploadAvatarMiddleware(req, res, next) {
  handleUpload(uploadAvatarImage, "avatar", req, res, next)
}
