import { Navigate, Outlet } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import axios from "axios"
import { setCredentials, logout } from "../../redux/slices/authSlice"
import { VITE_SERVER_API_URL } from "../../config/api"

export function ProtectedRoute() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const token = useSelector(state => state.auth.token)
  const user = useSelector(state => state.auth.user)
  const [isHydratingUser, setIsHydratingUser] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !token || user) return

    let isMounted = true

    async function hydrateUser() {
      setIsHydratingUser(true)

      try {
        const response = await axios.get(`${VITE_SERVER_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!isMounted) return

        dispatch(
          setCredentials({
            user: response.data.user,
            token,
          }),
        )
      } catch (error) {
        if (!isMounted) return
        dispatch(logout())
      } finally {
        if (isMounted) {
          setIsHydratingUser(false)
        }
      }
    }

    hydrateUser()

    return () => {
      isMounted = false
    }
  }, [dispatch, isAuthenticated, token, user])

  if (isAuthenticated && token && !user && isHydratingUser) {
    return <p>Loading profile...</p>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}

export function PublicRoute() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />
}
