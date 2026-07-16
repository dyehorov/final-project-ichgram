import styles from "./styles.module.css"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Link } from "react-router"
import Input from "../input"
import ButtonCTA from "../buttonCTA"
import forgotPasswordFormValidation from "../../validator/forms/forgotPasswordForm"

export default function ForgotPasswordForm() {
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const { login } = forgotPasswordFormValidation

  function handleForgotPassword() {
    reset()
    setIsError(false)
    setIsSuccess("If this account exists, a login link has been sent.")
  }

  return (
    <form onSubmit={handleSubmit(handleForgotPassword)} className={styles.form}>
      {isError && (
        <p className={styles.responseMessage}>
          <i className="fa-solid fa-circle-exclamation"></i>
          {isError}
        </p>
      )}
      {isSuccess && (
        <p className={styles.responseMessage}>
          <i className="fa-solid fa-circle-check"></i>
          {isSuccess}
        </p>
      )}

      <Input
        placeholder="Email, phone, or username"
        error={errors.login?.message}
        {...register("login", login)}
      />

      <ButtonCTA text="Reset your password" type="submit" fullWidth />

      <p className={styles.divider}>OR</p>

      <Link to="/register" className={styles.createAccountLink}>
        Create new account
      </Link>
    </form>
  )
}
