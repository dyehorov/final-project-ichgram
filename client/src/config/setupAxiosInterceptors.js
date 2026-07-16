import axios from "axios"
import { logout } from "../redux/slices/authSlice"
import { VITE_SERVER_API_URL } from "./api"

let isInterceptorConfigured = false

export default function setupAxiosInterceptors(store) {
  if (isInterceptorConfigured) return

  axios.interceptors.response.use(
    response => response,
    error => {
      const status = error.response?.status
      const requestUrl = error.config?.url || ""
      const isApiRequest = requestUrl.startsWith(VITE_SERVER_API_URL)

      if (isApiRequest && (status === 401 || status === 403)) {
        store.dispatch(logout())
      }

      return Promise.reject(error)
    },
  )

  isInterceptorConfigured = true
}
