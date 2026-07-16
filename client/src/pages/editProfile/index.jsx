import styles from "./styles.module.css"
import { useForm } from "react-hook-form"
import Input from "../../components/input"
import ButtonCTA from "../../components/buttonCTA"
import { useDispatch, useSelector } from "react-redux"
import avatarPlaceholder from "../../assets/icons/avatar-placeholder.png"
import axios from "axios"
import { VITE_SERVER_API_URL } from "../../config/api"
import { useState } from "react"
import { updateUser } from "../../redux/slices/authSlice"

export default function EditProfileForm() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const token = useSelector(state => state.auth.token)

  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState("")
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      website: user?.website || "",
      bio: user?.bio || "",
    },
  })

  const bio = watch("bio")

  function handleAvatarChange(e) {
    const file = e.target.files[0]

    if (!file) return

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const updateProfile = async data => {
    if (!user?._id || !token) {
      setIsSuccess(false)
      setIsError("User session is missing. Please log in again.")
      return
    }

    const formData = new FormData()

    formData.append("username", data.username)
    formData.append("website", data.website)
    formData.append("bio", data.bio)

    if (avatarFile) {
      formData.append("avatar", avatarFile)
    }

    try {
      const response = await axios.patch(
        `${VITE_SERVER_API_URL}/profile/${user._id}/edit-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      )

      setIsError(false)
      setIsSuccess(response.data.message)
      dispatch(updateUser(response.data.user))
    } catch (error) {
      console.log(error)

      setIsSuccess(false)
      setIsError(
        error.response?.data?.message ||
          "Something went wrong, try again later",
      )
    }
  }

  if (!user) {
    return <p className={styles.responseMessage}>User data is unavailable.</p>
  }

  return (
    <form onSubmit={handleSubmit(updateProfile)} className={styles.form}>
      {isError && <p className={styles.responseMessageError}>{isError}</p>}
      {isSuccess && (
        <p className={styles.responseMessageSuccess}>{isSuccess}</p>
      )}

      <div className={styles.profileCard}>
        <img
          src={
            avatarPreview ||
            (user?.avatar
              ? `${VITE_SERVER_API_URL}${user.avatar}`
              : avatarPlaceholder)
          }
          alt="avatar"
          className={styles.avatar}
        />

        <div>
          <h3>{user?.username}</h3>
          <p>{user?.bio}</p>
        </div>

        <label htmlFor="avatar-upload" className={styles.photoButton}>
          New photo
        </label>

        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className={styles.fileInput}
        />
      </div>

      <div className={styles.field}>
        <label>Username</label>
        <Input
          placeholder="Username"
          error={errors.username?.message}
          {...register("username")}
        />
      </div>

      <div className={styles.field}>
        <label>Website</label>
        <Input
          placeholder="Website"
          error={errors.website?.message}
          {...register("website")}
        />
      </div>

      <div className={styles.field}>
        <label>About</label>

        <div className={styles.textareaWrapper}>
          <textarea maxLength={150} {...register("bio")} />
          <span className={styles.counter}>{bio?.length || 0} / 150</span>
        </div>
      </div>

      <ButtonCTA text="Save" type="submit" />
    </form>
  )
}
