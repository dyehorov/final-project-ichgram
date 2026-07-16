import styles from "./styles.module.css"

export default function Input({ error, ...props }) {
  return (
    <div className={styles.inputGroup}>
      <input className={styles.input} {...props} />

      {error && <p className={styles.inputError}>{error}</p>}
    </div>
  )
}
