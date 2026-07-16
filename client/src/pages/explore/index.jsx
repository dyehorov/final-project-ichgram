import { useEffect, useState } from "react"
import axios from "axios"
import styles from "./styles.module.css"
import { VITE_SERVER_API_URL } from "../../config/api"
import Post from "../../components/post"
import Modal from "../../components/modal"
import PostDetailsModal from "../../components/postDetailsModal"
import { useSelector } from "react-redux"

export default function Explore() {
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [isLikePending, setIsLikePending] = useState(false)
  const token = useSelector(state => state.auth.token)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get(`${VITE_SERVER_API_URL}/posts`)
        setPosts(response.data.posts)
      } catch (error) {
        console.log(error)
      }
    }

    fetchPosts()
  }, [])

  async function handleToggleLike() {
    if (!selectedPost?._id || !token || isLikePending) return

    try {
      setIsLikePending(true)

      const response = await axios.patch(
        `${VITE_SERVER_API_URL}/posts/${selectedPost._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const updatedPost = response.data.post

      setSelectedPost(updatedPost)
      setPosts(currentPosts =>
        currentPosts.map(post =>
          post._id === updatedPost._id ? updatedPost : post,
        ),
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

  return (
    <main className={styles.explore}>
      <ul className={styles.grid}>
        {posts.map(post => (
          <li key={post._id} className={styles.item}>
            <Post
              post={post}
              username={post.author?.username || "User"}
              onClick={() => setSelectedPost(post)}
            />
          </li>
        ))}
      </ul>

      {selectedPost && (
        <Modal onClose={() => setSelectedPost(null)}>
          <PostDetailsModal
            post={selectedPost}
            onToggleLike={handleToggleLike}
            isLikePending={isLikePending}
            onCommentCreated={handleCommentCreated}
          />
        </Modal>
      )}
    </main>
  )
}
