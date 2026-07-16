import { useEffect, useState } from "react"
import axios from "axios"
import styles from "./styles.module.css"
import { VITE_SERVER_API_URL } from "../../config/api"
import avatarPlaceholder from "../../assets/icons/avatar-placeholder.png"
import { useSelector } from "react-redux"
import Modal from "../../components/modal"
import PostDetailsModal from "../../components/postDetailsModal"
import { useNavigate } from "react-router"

function normalizeId(value) {
  if (!value) return ""

  return typeof value === "object" ? value._id || String(value) : String(value)
}

function formatRelativeDate(date) {
  if (!date) return ""

  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.max(1, Math.floor((now - target) / 1000))

  if (diffInSeconds < 60) return `${diffInSeconds}s`

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes}m`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d`

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 5) return `${diffInWeeks}w`

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(target)
}

export default function Home() {
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [isLikePending, setIsLikePending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const token = useSelector(state => state.auth.token)
  const currentUserId = useSelector(state => state.auth.user?._id)
  const navigate = useNavigate()

  async function fetchPosts() {
    try {
      setIsLoading(true)
      setErrorMessage("")

      const response = await axios.get(`${VITE_SERVER_API_URL}/posts`)
      setPosts(response.data.posts)
    } catch (error) {
      console.log(error)
      setErrorMessage("Failed to load posts. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  async function handleToggleLike(postId) {
    if (!postId || !token || isLikePending) return

    try {
      setIsLikePending(true)

      const response = await axios.patch(
        `${VITE_SERVER_API_URL}/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const updatedPost = response.data.post

      setPosts(currentPosts =>
        currentPosts.map(post =>
          post._id === updatedPost._id ? updatedPost : post,
        ),
      )

      setSelectedPost(currentPost =>
        currentPost?._id === updatedPost._id ? updatedPost : currentPost,
      )
    } catch (error) {
      console.log(error)
    } finally {
      setIsLikePending(false)
    }
  }

  function handleCommentCreated(postId, newComment) {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post._id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), newComment._id],
            }
          : post,
      ),
    )

    setSelectedPost(currentPost =>
      currentPost?._id === postId
        ? {
            ...currentPost,
            comments: [...(currentPost.comments || []), newComment._id],
          }
        : currentPost,
    )
  }

  if (isLoading) {
    return (
      <main className={styles.home}>
        <section className={styles.feed}>
          {Array.from({ length: 4 }).map((_, index) => (
            <article key={index} className={styles.post}>
              <div className={styles.skeletonHeader}></div>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonText}></div>
            </article>
          ))}
        </section>
      </main>
    )
  }

  if (errorMessage) {
    return (
      <main className={styles.home}>
        <section className={styles.stateCard}>
          <p>{errorMessage}</p>
          <button
            type="button"
            onClick={fetchPosts}
            className={styles.retryButton}
          >
            Retry
          </button>
        </section>
      </main>
    )
  }

  if (posts.length === 0) {
    return (
      <main className={styles.home}>
        <section className={styles.stateCard}>
          <p>No posts yet.</p>
        </section>
      </main>
    )
  }

  return (
    <main className={styles.home}>
      <section className={styles.feed}>
        {posts.map(post => {
          const author = post.author || post.user
          const isLiked = post.likes?.some(
            likeId => normalizeId(likeId) === normalizeId(currentUserId),
          )

          return (
            <article key={post._id} className={styles.post}>
              <header className={styles.header}>
                <img
                  src={
                    author?.avatar
                      ? `${VITE_SERVER_API_URL}${author.avatar}`
                      : avatarPlaceholder
                  }
                  alt="avatar"
                  className={styles.avatar}
                />

                <div className={styles.meta}>
                  <button
                    type="button"
                    className={styles.usernameButton}
                    onClick={() => navigate(`/profile/${author?._id}`)}
                  >
                    {author?.username || "User"}
                  </button>
                  <span> · {formatRelativeDate(post.createdAt)}</span>
                </div>
              </header>

              <button
                type="button"
                className={styles.imageButton}
                onClick={() => setSelectedPost(post)}
              >
                <img
                  src={`${VITE_SERVER_API_URL}${post.image}`}
                  alt={post.caption || "post"}
                  className={styles.image}
                />
              </button>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={
                    isLiked ? styles.actionActive : styles.actionButton
                  }
                  onClick={() => handleToggleLike(post._id)}
                  disabled={isLikePending}
                >
                  <i
                    className={
                      isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"
                    }
                  ></i>
                </button>

                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => setSelectedPost(post)}
                >
                  <i className="fa-regular fa-comment"></i>
                </button>
              </div>

              <p className={styles.likes}>
                {post.likes?.length || 0}{" "}
                {post.likes?.length === 1 ? "like" : "likes"}
              </p>

              {post.caption && (
                <p className={styles.caption}>
                  <button
                    type="button"
                    className={styles.captionUsername}
                    onClick={() => navigate(`/profile/${author?._id}`)}
                  >
                    {author?.username || "User"}
                  </button>{" "}
                  {post.caption}
                </p>
              )}
            </article>
          )
        })}
      </section>

      {selectedPost && (
        <Modal onClose={() => setSelectedPost(null)}>
          <PostDetailsModal
            post={selectedPost}
            onToggleLike={() => handleToggleLike(selectedPost._id)}
            isLikePending={isLikePending}
            onCommentCreated={handleCommentCreated}
          />
        </Modal>
      )}
    </main>
  )
}
