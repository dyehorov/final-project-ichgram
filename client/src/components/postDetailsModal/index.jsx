import styles from "./styles.module.css"
import { VITE_SERVER_API_URL } from "../../config/api"
import avatarPlaceholder from "../../assets/icons/avatar-placeholder.png"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"

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
}) {
  const author = post.author || {}
  const currentUserId = useSelector(state => state.auth.user?._id)
  const isLiked = post.likes?.some(likeId => likeId === currentUserId)
  const navigate = useNavigate()

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
        </footer>
      </div>
    </article>
  )
}
