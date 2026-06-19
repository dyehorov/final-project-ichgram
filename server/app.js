import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRouter from "./routes/auth.js"
import connectDB from "./config/db.js"
import cors from "cors"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use("/auth", authRouter)

app.get("/", (req, res) => {
  res.status(200).send("Final project")
})

async function startServer() {
  await connectDB()

  app.listen(port, () => {
    console.log(`Server is runnning on http://127.0.0.1:${port}`)
  })
}

startServer()
