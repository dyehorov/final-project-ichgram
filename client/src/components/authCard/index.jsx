import styles from "./styles.module.css"
import logo from "../../assets/icons/ichgram-logo.png"
import AuthFooter from "../authFooter"

export default function AuthCard({
  children,
  subtitle,
  footerQuestion,
  footerLink,
  footerPath,
}) {
  return (
    <div className={styles.authCard}>
      <div className={styles.authCardMain}>
        <div className={styles.logo}>
          <img src={logo} alt="ICHGRAM logo" />
        </div>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
      </div>
      <AuthFooter
        question={footerQuestion}
        link={footerLink}
        path={footerPath}
      />
    </div>
  )
}
