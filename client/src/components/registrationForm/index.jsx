import styles from "./styles.module.css"
import { useForm } from "react-hook-form"
import Input from "../../components/input"
import ButtonCTA from "../../components/buttonCTA"
import registerFormValidation from "../../validator/forms/registerForm"
import { useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import { VITE_SERVER_API_URL } from "../../config/api"

export default function RegisterForm() {
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const navigate = useNavigate()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const { email, fullName, username, password } = registerFormValidation

  const registerUser = async data => {
    try {
      const response = await axios.post(
        `${VITE_SERVER_API_URL}/auth/register`,
        data,
      )

      reset()
      setIsError(false)
      setIsSuccess(response.data.message)
      navigate("/")
    } catch (error) {
      console.log(error)

      setIsError(
        error.response?.data?.message ||
          "Something went wrong, try again later",
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(registerUser)} className={styles.form}>
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
        placeholder="Email"
        error={errors.email?.message}
        {...register("email", email)}
      />
      <Input
        placeholder="Full Name"
        error={errors.fullName?.message}
        {...register("fullName", fullName)}
      />
      <Input
        placeholder="Username"
        error={errors.username?.message}
        {...register("username", username)}
      />
      <Input
        type="password"
        placeholder="Password"
        error={errors.password?.message}
        {...register("password", password)}
      />
      <p className={styles.terms}>
        People who use our service may have uploaded your contact information to
        Instagram.{" "}
        <a href="#" className={styles.termsLink}>
          Learn More
        </a>
      </p>
      <p className={styles.terms}>
        By signing up, you agree to our{" "}
        <a href="#" className={styles.termsLink}>
          Terms
        </a>
        ,
        <a href="#" className={styles.termsLink}>
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="#" className={styles.termsLink}>
          Cookies Policy
        </a>
        .
      </p>
      <ButtonCTA text="Sign up" type="submit" fullWidth />
    </form>
  )
}
