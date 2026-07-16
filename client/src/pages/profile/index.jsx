import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import styles from "./styles.module.css"
import avatarPlaceholder from "../../assets/icons/avatar-placeholder.png"
import ButtonCTA from "../../components/buttonCTA"
import { useNavigate, useParams } from "react-router"
import axios from "axios"
import { VITE_SERVER_API_URL } from "../../config/api"
import Post from "../../components/post"
import Modal from "../../components/modal"
import PostDetailsModal from "../../components/postDetailsModal"
import { updateUser } from "../../redux/slices/authSlice"

function normalizeId(value) {
  if (!value) return ""
  return typeof value === "object" ? value._id || String(value) : String(value)
}

async function fetchUserPosts(userId, token) {
  if (!userId || !token) return []

  const response = await axios.get(
    `${VITE_SERVER_API_URL}/posts/user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response.data.posts
}

export default function Profile() {
  const dispatch = useDispatch()
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [isLikePending, setIsLikePending] = useState(false)
  const [isFollowPending, setIsFollowPending] = useState(false)
  const [profileUser, setProfileUser] = useState(null)
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const authUser = useSelector(state => state.auth.user)
  const token = useSelector(state => state.auth.token)
  const navigate = useNavigate()
  const { userId } = useParams()
  const viewedUserId = userId || authUser?._id
  const isOwnProfile = !userId || userId === authUser?._id
  const isFollowing = authUser?.following?.some(
    followedUserId => normalizeId(followedUserId) === normalizeId(viewedUserId),
  )

  useEffect(() => {
    let isMounted = true

    async function fetchProfileUser() {
      if (!viewedUserId || !token) return

      try {
        setIsProfileLoading(true)

        if (isOwnProfile && authUser) {
          if (isMounted) {
            setProfileUser(authUser)
          }
          return
        }

        const response = await axios.get(
          `${VITE_SERVER_API_URL}/profile/${viewedUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (isMounted) {
          setProfileUser(response.data.user)
        }
      } catch (error) {
        console.log(error)
      } finally {
        if (isMounted) {
          setIsProfileLoading(false)
        }
      }
    }

    fetchProfileUser()

    return () => {
      isMounted = false
    }
  }, [authUser, isOwnProfile, token, viewedUserId])

  useEffect(() => {
    let isMounted = true

    fetchUserPosts(viewedUserId, token).then(userPosts => {
      if (isMounted) {
        setPosts(userPosts)
      }
    })

    function handlePostCreated() {
      fetchUserPosts(viewedUserId, token).then(userPosts => {
        if (isMounted) {
          setPosts(userPosts)
        }
      })
    }

    window.addEventListener("post-created", handlePostCreated)

    return () => {
      isMounted = false
      window.removeEventListener("post-created", handlePostCreated)
    }
  }, [token, viewedUserId])

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

  async function handleToggleFollow() {
    if (!viewedUserId || !token || isOwnProfile || isFollowPending) return

    try {
      setIsFollowPending(true)

      const response = await axios.patch(
        `${VITE_SERVER_API_URL}/profile/${viewedUserId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      dispatch(updateUser(response.data.currentUser))
      setProfileUser(response.data.targetUser)
    } catch (error) {
      console.log(error)
    } finally {
      setIsFollowPending(false)
    }
  }

  if (isProfileLoading && !profileUser) {
    return <main className={styles.profile}>Loading profile...</main>
  }

  if (!profileUser) {
    return <main className={styles.profile}>Profile not found.</main>
  }

  return (
    <main className={styles.profile}>
      <section className={styles.header}>
        <div className={styles.avatar}>
          <img
            className={styles.avatar}
            src={
              profileUser?.avatar
                ? `${VITE_SERVER_API_URL}${profileUser.avatar}`
                : avatarPlaceholder
            }
            alt="User avatar"
          />
        </div>

        <div className={styles.info}>
          <div className={styles.top}>
            <h2>{profileUser?.username}</h2>
            {isOwnProfile && (
              <ButtonCTA
                text={"Edit profile"}
                variant="secondary"
                strictWidth={true}
                onClick={() => navigate("/edit-profile")}
              />
            )}
            {!isOwnProfile && (
              <>
                <ButtonCTA
                  text={isFollowing ? "Following" : "Follow"}
                  variant={isFollowing ? "secondary" : "primary"}
                  strictWidth={true}
                  disabled={isFollowPending}
                  onClick={handleToggleFollow}
                />
                <ButtonCTA text={"Message"} variant="secondary" />
              </>
            )}
          </div>

          <div className={styles.stats}>
            <span>
              <b>{posts.length}</b> posts
            </span>
            <span>
              <b>{profileUser?.followers?.length || 0}</b> followers
            </span>
            <span>
              <b>{profileUser?.following?.length || 0}</b> following
            </span>
          </div>

          <p className={styles.name}>{profileUser?.fullName}</p>
          {profileUser?.bio && <p className={styles.bio}>{profileUser.bio}</p>}
        </div>
      </section>

      <section className={styles.grid}>
        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map(post => (
            <Post
              key={post._id}
              post={post}
              username={profileUser?.username || "User"}
              onClick={() => setSelectedPost(post)}
            />
          ))
        )}
      </section>

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
