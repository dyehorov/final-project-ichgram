import styles from "./styles.module.css"
import logo from "../../assets/icons/ichgram-logo.png"
import { Link } from "react-router"

export default function AuthFooter({ question, link, path }) {
  return (
    <div className={styles.authFooter}>
      <p>
        {question}{" "}
        <Link to={path} className={styles.link}>
          {link}
        </Link>
      </p>
    </div>
  )
}
