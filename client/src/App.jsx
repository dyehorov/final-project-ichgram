import "./App.css"
import ButtonCTA from "./components/buttonCTA"
import AuthCard from "./components/authCard"
import { Routes, Route } from "react-router"
import Registration from "./pages/registration"
import Login from "./pages/login"
import Aside from "./components/aside"
import MainLayout from "./layouts/mainLayout"
import Home from "./pages/home"
import Explore from "./pages/explore"
// import Messages from "./pages/messages"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
        </Route>
      </Routes>
    </>
  )
}
