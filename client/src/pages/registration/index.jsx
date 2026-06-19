import styles from "./styles.module.css"
import AuthCard from "../../components/authCard"
import RegisterForm from "../../components/registrationForm"

export default function Registration() {
  return (
    <div className={styles.registerContainer}>
      <AuthCard
        subtitle={"Sign up to see photos and videos from your friends."}
        footerQuestion={"Have an account?"}
        footerLink={"Login"}
        footerPath={"/"}
      >
        <RegisterForm />
      </AuthCard>
    </div>
  )
}
