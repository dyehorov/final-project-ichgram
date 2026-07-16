import "./App.css"
import { Routes, Route } from "react-router"
import Registration from "./pages/registration"
import Login from "./pages/login"
import MainLayout from "./layouts/mainLayout"
import Home from "./pages/home"
import Explore from "./pages/explore"
import EditProfile from "./pages/editProfile"
import Messages from "./pages/messages"
import Profile from "./pages/profile"
import ForgotPassword from "./pages/forgotPassword"
import { BrowserRouter } from "react-router"
import { ProtectedRoute, PublicRoute } from "./components/routeGuard"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
