import styles from "./styles.module.css"
import { VITE_SERVER_API_URL } from "../../config/api"

export default function Post({ post, username, onClick }) {
  return (
    <button type="button" className={styles.post} onClick={onClick}>
      <img
        src={`${VITE_SERVER_API_URL}${post.image}`}
        alt={`${username} post`}
      />

      <div className={styles.overlay}>
        <div className={styles.stat}>
          <i className="fa-solid fa-heart"></i>
          <span>{post.likes?.length || 0}</span>
        </div>

        <div className={styles.stat}>
          <i className="fa-solid fa-comment"></i>
          <span>{post.comments?.length || 0}</span>
        </div>
      </div>
    </button>
  )
}
