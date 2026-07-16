import styles from "./styles.module.css"
import messageAvatarNikiita from "../../assets/icons/message-avatar-nikiita.jpg"
import messageAvatarSashaa from "../../assets/icons/message-avatar-sashaa.jpg"
import postPreviewImage from "../../assets/icons/main-page-image.jpg"

const mockNotifications = [
  {
    id: "notification-1",
    username: "nikiita",
    avatar: messageAvatarNikiita,
    text: "follows you",
    time: "2h",
  },
  {
    id: "notification-2",
    username: "sashaa",
    avatar: messageAvatarSashaa,
    text: "commented on your photo",
    time: "5h",
    previewImage: postPreviewImage,
  },
  {
    id: "notification-3",
    username: "nikiita",
    avatar: messageAvatarNikiita,
    text: "liked your photo",
    time: "1d",
    previewImage: postPreviewImage,
  },
]

export default function NotificationsModal() {
  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Notifications</h2>

      <p className={styles.subtitle}>New</p>
      <div className={styles.list}>
        {mockNotifications.map(notification => (
          <article key={notification.id} className={styles.card}>
            <div className={styles.main}>
              <img
                src={notification.avatar}
                alt={`${notification.username} avatar`}
                className={styles.avatar}
              />

              <p className={styles.text}>
                <span className={styles.username}>{notification.username}</span>{" "}
                {notification.text}{" "}
                <span className={styles.time}>{notification.time}</span>
              </p>
            </div>

            {notification.previewImage && (
              <img
                src={notification.previewImage}
                alt="Post preview"
                className={styles.previewImage}
              />
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
