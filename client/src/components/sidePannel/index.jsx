import styles from "./styles.module.css"
import SearchModal from "../searchModal"
import NotificationsModal from "../notificationsModal"
// import CreatePanel from "../createPanel"

export default function SidePanel({ panel, onClose }) {
  switch (panel) {
    case "search":
      return <SearchModal onClose={onClose} />

    case "notifications":
      return <NotificationsModal onClose={onClose} />

    default:
      return null
  }
}
