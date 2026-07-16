import dotenv from "dotenv"
import connectDB from "../config/db.js"
import Like from "../models/Like.js"
import Post from "../models/Post.js"

dotenv.config()

async function migratePostLikes() {
  await connectDB()

  const posts = await Post.collection
    .find({ likes: { $exists: true, $type: "array", $ne: [] } })
    .toArray()

  let migratedLikesCount = 0

  for (const post of posts) {
    for (const userId of post.likes) {
      await Like.updateOne(
        { post: post._id, user: userId },
        { $setOnInsert: { post: post._id, user: userId } },
        { upsert: true },
      )

      migratedLikesCount += 1
    }
  }

  console.log(
    `Migration completed. Processed ${posts.length} posts and ${migratedLikesCount} likes.`,
  )

  process.exit(0)
}

migratePostLikes().catch(error => {
  console.error("Like migration failed:", error)
  process.exit(1)
})
