import styles from "./styles.module.css"
import { VITE_SERVER_API_URL } from "../../config/api"
import avatarPlaceholder from "../../assets/icons/avatar-placeholder.png"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import axios from "axios"

function normalizeId(value) {
  if (!value) return ""
  return typeof value === "object" ? value._id || String(value) : String(value)
}

function formatDate(date) {
  if (!date) return ""

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export default function PostDetailsModal({
  post,
  onToggleLike,
  isLikePending,
  onCommentCreated,
}) {
  const author = post.author || {}
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const [isCommentsLoading, setIsCommentsLoading] = useState(true)
  const [isCommentPending, setIsCommentPending] = useState(false)
  const currentUserId = useSelector(state => state.auth.user?._id)
  const token = useSelector(state => state.auth.token)
  const isLiked = post.likes?.some(
    likeId => normalizeId(likeId) === normalizeId(currentUserId),
  )
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    async function fetchComments() {
      try {
        setIsCommentsLoading(true)

        const response = await axios.get(
          `${VITE_SERVER_API_URL}/posts/${post._id}/comments`,
        )

        if (isMounted) {
          setComments(response.data.comments)
        }
      } catch (error) {
        console.log(error)
      } finally {
        if (isMounted) {
          setIsCommentsLoading(false)
        }
      }
    }

    fetchComments()

    return () => {
      isMounted = false
    }
  }, [post._id])

  async function handleSubmitComment(event) {
    event.preventDefault()

    if (!token || !commentText.trim() || isCommentPending) return

    try {
      setIsCommentPending(true)

      const response = await axios.post(
        `${VITE_SERVER_API_URL}/posts/${post._id}/comments`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const newComment = response.data.comment

      setComments(currentComments => [newComment, ...currentComments])
      setCommentText("")

      if (onCommentCreated) {
        onCommentCreated(post._id, newComment)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsCommentPending(false)
    }
  }

  return (
    <article className={styles.postModal}>
      <div className={styles.imageWrap}>
        <img
          src={`${VITE_SERVER_API_URL}${post.image}`}
          alt={`${author.username || "User"} post`}
          className={styles.image}
        />
      </div>

      <div className={styles.sidebar}>
        <header
          className={styles.header}
          onClick={() => navigate(`/profile/${author?._id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={event => {
            if (event.key === "Enter" || event.key === " ") {
              navigate(`/profile/${author?._id}`)
            }
          }}
        >
          <img
            src={
              author.avatar
                ? `${VITE_SERVER_API_URL}${author.avatar}`
                : avatarPlaceholder
            }
            alt={`${author.username || "User"} avatar`}
            className={styles.avatar}
          />

          <div>
            <p className={styles.username}>{author.username || "User"}</p>
            {author.fullName && (
              <p className={styles.fullName}>{author.fullName}</p>
            )}
          </div>
        </header>

        <div className={styles.content}>
          {post.caption ? (
            <p className={styles.caption}>{post.caption}</p>
          ) : (
            <p className={styles.empty}>No caption</p>
          )}

          <div className={styles.comments}>
            {isCommentsLoading ? (
              <p className={styles.empty}>Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className={styles.empty}>No comments yet</p>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className={styles.comment}>
                  <img
                    src={
                      comment.author?.avatar
                        ? `${VITE_SERVER_API_URL}${comment.author.avatar}`
                        : avatarPlaceholder
                    }
                    alt={`${comment.author?.username || "User"} avatar`}
                    className={styles.commentAvatar}
                  />

                  <div className={styles.commentBody}>
                    <p className={styles.commentText}>
                      <span className={styles.commentUsername}>
                        {comment.author?.username || "User"}
                      </span>{" "}
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.stats}>
            <button
              type="button"
              className={isLiked ? styles.likeButtonActive : styles.likeButton}
              onClick={onToggleLike}
              disabled={isLikePending}
            >
              <i
                className={
                  isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"
                }
              ></i>{" "}
              {post.likes?.length || 0}
            </button>
          </div>

          <time className={styles.date}>{formatDate(post.createdAt)}</time>

          <form className={styles.commentForm} onSubmit={handleSubmitComment}>
            <input
              type="text"
              value={commentText}
              onChange={event => setCommentText(event.target.value)}
              placeholder="Add a comment..."
              className={styles.commentInput}
            />
            <button
              type="submit"
              className={styles.commentSubmit}
              disabled={!commentText.trim() || isCommentPending}
            >
              Comment
            </button>
          </form>
        </footer>
      </div>
    </article>
  )
}
