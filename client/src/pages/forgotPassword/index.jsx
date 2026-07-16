import styles from "./styles.module.css"
import AuthCard from "../../components/authCard"
import ForgotPasswordForm from "../../components/forgotPasswordForm"
import resetPasswordIcon from "../../assets/icons/reset-password-icon.jpg"

export default function ForgotPassword() {
  return (
    <div className={styles.forgotPasswordContainer}>
      <AuthCard
        headerImage={resetPasswordIcon}
        headerImageAlt="Reset password icon"
        compactHeader={true}
        title={"Trouble logging in?"}
        subtitle={
          "Enter your email, phone, or username and we'll send you a link to get back into your account."
        }
        footerLink={"Back to login"}
        footerPath={"/"}
      >
        <ForgotPasswordForm />
      </AuthCard>
    </div>
  )
}
