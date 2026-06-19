import styles from "./styles.module.css"
import AuthCard from "../../components/authCard"
import LoginForm from "../../components/loginForm"
import MainPageImage from "../../assets/icons/main-page-image.jpg"

export default function Login() {
  return (
    <div className={styles.loginContainer}>
      <div>
        <img src={MainPageImage} alt="Main page image" />
      </div>
      <AuthCard
        footerQuestion={"Do you have an account?"}
        footerLink={"Sign up"}
        footerPath={"/register"}
      >
        <LoginForm />
      </AuthCard>
    </div>
  )
}
