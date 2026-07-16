import styles from "./styles.module.css"
import { Link } from "react-router"

export default function AuthFooter({ question, link, path }) {
  return (
    <div className={styles.authFooter}>
      {question ? (
        <p>
          {question}{" "}
          <Link to={path} className={styles.link}>
            {link}
          </Link>
        </p>
      ) : (
        <Link to={path} className={styles.link}>
          {link}
        </Link>
      )}
    </div>
  )
}
