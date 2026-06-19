import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const dbURI = process.env.MONGO_URI

export default async function connectDB() {
  try {
    await mongoose.connect(dbURI)
    console.log("MongoDB Connected!")
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message)
  }
}
