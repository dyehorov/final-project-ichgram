import styles from "./styles.module.css"
import { useForm } from "react-hook-form"
import Input from "../../components/input"
import ButtonCTA from "../../components/buttonCTA"
import loginFormValidation from "../../validator/forms/loginForm"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { setCredentials } from "../../redux/slices/authSlice"
import { VITE_SERVER_API_URL } from "../../config/api"

export default function LoginForm() {
  let navigate = useNavigate()
  const dispatch = useDispatch()
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const { login, password } = loginFormValidation

  const loginUser = async data => {
    try {
      const response = await axios.post(
        `${VITE_SERVER_API_URL}/auth/login`,
        data,
      )

      if (!response.data.token) {
        setIsError("Token was not returned by server")
        return
      }

      setIsError(false)
      setIsSuccess(response.data.message)

      dispatch(
        setCredentials({
          user: response.data.user,
          token: response.data.token,
        }),
      )

      navigate("/home")
    } catch (error) {
      setIsError(
        error.response?.data?.message ||
          "Something went wrong, try again later.",
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(loginUser)} className={styles.form}>
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
        placeholder="Username, or email"
        error={errors.login?.message}
        {...register("login", login)}
      />
      <Input
        type="password"
        placeholder="Password"
        error={errors.password?.message}
        {...register("password", password)}
      />

      <ButtonCTA text="Log in" type="submit" fullWidth />

      <p className={styles.loginDivider}>OR</p>

      <a href="#" className={styles.link}>
        Forgot password?
      </a>
    </form>
  )
}
