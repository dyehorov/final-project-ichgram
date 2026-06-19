import styles from "./styles.module.css"

export default function ButtonCTA({
  text,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  strictWidth = false,
}) {
  const buttonClass = `${styles.btn} ${styles[variant]} ${strictWidth ? styles.strictWidth : ""}`

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  )
}
