import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import styles from "./styles.module.css"
import uploadImageIcon from "../../assets/icons/upload-image-icon.png"
import avatarPlaceholder from "../../assets/icons/avatar-placeholder.png"
import createPostModalEmoji from "../../assets/icons/create-post-emoji.png"
import { useSelector } from "react-redux"
import { VITE_SERVER_API_URL } from "../../config/api"

export default function CreatePostModal({ onSuccess }) {
  const [imageFile, setImageFile] = useState(null)
  const [caption, setCaption] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const user = useSelector(state => state.auth.user)
  const token = useSelector(state => state.auth.token)

  const imagePreview = useMemo(() => {
    if (!imageFile) return null

    return URL.createObjectURL(imageFile)
  }, [imageFile])

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) return

    setImageFile(file)
  }

  async function handleSubmit() {
    if (!imageFile || isLoading) return

    try {
      setIsLoading(true)

      const formData = new FormData()
      formData.append("image", imageFile)
      formData.append("caption", caption.trim())

      await axios.post(`${VITE_SERVER_API_URL}/posts/create-post`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setImageFile(null)
      setCaption("")

      window.dispatchEvent(new Event("post-created"))
      onSuccess?.()
    } catch (error) {
      console.log(error.response?.data || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h3>Create new post</h3>

        <button
          className={styles.share}
          onClick={handleSubmit}
          disabled={!imageFile || isLoading}
        >
          {isLoading ? "Sharing..." : "Share"}
        </button>
      </header>

      <div className={styles.content}>
        <div className={styles.upload}>
          <label htmlFor="imageInput" className={styles.uploadArea}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className={styles.previewImage}
              />
            ) : (
              <img
                src={uploadImageIcon}
                alt=""
                className={styles.uploadImageIcon}
              />
            )}
          </label>

          <input
            id="imageInput"
            type="file"
            accept="image/*"
            className={styles.input}
            onChange={handleImageChange}
          />
        </div>

        <div className={styles.sidebar}>
          <div className={styles.user}>
            <img
              className={styles.avatar}
              src={
                user.avatar
                  ? `${VITE_SERVER_API_URL}${user.avatar}`
                  : avatarPlaceholder
              }
              alt="User avatar"
            />

            <strong>{user?.username || "Unknown user"}</strong>
          </div>

          <textarea
            className={styles.textarea}
            placeholder="Write a caption..."
            maxLength={2200}
            value={caption}
            onChange={e => setCaption(e.target.value)}
          />

          <div className={styles.footer}>
            <img src={createPostModalEmoji} alt="Emoji" />
            <span>{caption.length} / 2 200</span>
          </div>
        </div>
      </div>
    </div>
  )
}
