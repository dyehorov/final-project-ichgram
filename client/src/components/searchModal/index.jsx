import styles from "./styles.module.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { VITE_SERVER_API_URL } from "../../config/api"
import avatarPlaceholder from "../../assets/icons/avatar-placeholder.png"

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const token = useSelector(state => state.auth.token)
  const navigate = useNavigate()

  useEffect(() => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setUsers([])
      setIsLoading(false)
      setHasSearched(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsLoading(true)

        const response = await axios.get(
          `${VITE_SERVER_API_URL}/profile/search/users`,
          {
            params: { query: trimmedQuery },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        setUsers(response.data.users)
        setHasSearched(true)
      } catch (error) {
        console.log(error)
        setUsers([])
        setHasSearched(true)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, token])

  function handleOpenProfile(userId) {
    navigate(`/profile/${userId}`)
    onClose()
  }

  return (
    <section className={styles.panel}>
      <h2>Search</h2>

      <div className={styles.searchBox}>
        <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
        <input
          type="text"
          placeholder="Search by username or name"
          value={query}
          onChange={event => setQuery(event.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.results}>
        {!query.trim() && (
          <p className={styles.stateText}>
            Find friends and interesting accounts.
          </p>
        )}

        {isLoading && <p className={styles.stateText}>Searching...</p>}

        {!isLoading && hasSearched && users.length === 0 && (
          <p className={styles.stateText}>No users found.</p>
        )}

        {!isLoading &&
          users.map(user => (
            <button
              key={user._id}
              type="button"
              className={styles.userCard}
              onClick={() => handleOpenProfile(user._id)}
            >
              <img
                src={
                  user.avatar
                    ? `${VITE_SERVER_API_URL}${user.avatar}`
                    : avatarPlaceholder
                }
                alt={`${user.username} avatar`}
                className={styles.avatar}
              />

              <div className={styles.userMeta}>
                <p className={styles.username}>{user.username}</p>
                <p className={styles.fullName}>{user.fullName}</p>
              </div>
            </button>
          ))}
      </div>
    </section>
  )
}
