import multer from "multer"
import path from "path"
import fs from "fs"

function ensureUploadDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true })
  }
}

export function createImageUpload(folderName) {
  const uploadPath = path.join("uploads", folderName)

  ensureUploadDirectory(uploadPath)

  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadPath)
      },
      filename: (req, file, cb) => {
        const extension = path.extname(file.originalname)

        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`)
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true)
        return
      }

      cb(new Error("Only images allowed"), false)
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  })
}
