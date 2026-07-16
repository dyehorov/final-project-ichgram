import styles from "./styles.module.css"
import logo from "../../assets/icons/ichgram-logo.png"
import AuthFooter from "../authFooter"

export default function AuthCard({
  children,
  title,
  subtitle,
  footerQuestion,
  footerLink,
  footerPath,
  headerImage,
  headerImageAlt = "ICHGRAM logo",
  compactHeader = false,
}) {
  return (
    <div className={styles.authCard}>
      <div className={styles.authCardMain}>
        <div className={compactHeader ? styles.compactHeader : styles.logo}>
          <img src={headerImage || logo} alt={headerImageAlt} />
        </div>
        {title && <h1 className={styles.title}>{title}</h1>}
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
