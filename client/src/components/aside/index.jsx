import { NavLink } from "react-router"
import logo from "../../assets/icons/ichgram-logo.png"
import styles from "./styles.module.css"

import homeIcon from "../../assets/icons/nav-icons/home-nav.svg"
import homeFilledIcon from "../../assets/icons/nav-icons/home-nav-filled.svg"

import searchIcon from "../../assets/icons/nav-icons/search-nav.svg"
import searchFilledIcon from "../../assets/icons/nav-icons/search-nav-filled.svg"

import exploreIcon from "../../assets/icons/nav-icons/explore-nav.svg"
import exploreFilledIcon from "../../assets/icons/nav-icons/explore-nav-filled.svg"

import messagesIcon from "../../assets/icons/nav-icons/messages-nav.svg"
import messagesFilledIcon from "../../assets/icons/nav-icons/messages-nav-filled.svg"

import notificationIcon from "../../assets/icons/nav-icons/notification-nav.svg"
import notificationFilledIcon from "../../assets/icons/nav-icons/notification-nav-filled.svg"

import createIcon from "../../assets/icons/nav-icons/create-nav.svg"

export const navMenu = [
  {
    title: "Home",
    path: "/home",
    icon: homeIcon,
    activeIcon: homeFilledIcon,
  },
  {
    title: "Search",
    action: "search",
    icon: searchIcon,
    activeIcon: searchFilledIcon,
  },
  {
    title: "Explore",
    path: "/explore",
    icon: exploreIcon,
    activeIcon: exploreFilledIcon,
  },
  {
    title: "Messages",
    path: "/messages",
    icon: messagesIcon,
    activeIcon: messagesFilledIcon,
  },
  {
    title: "Notifications",
    action: "notifications",
    icon: notificationIcon,
    activeIcon: notificationFilledIcon,
  },
  {
    title: "Create",
    action: "create",
    icon: createIcon,
    activeIcon: createIcon,
  },
]

export default function Aside({ activePanel, onOpenPanel, onClosePanel }) {
  const hasActivePanel = activePanel === "search" || activePanel === "notifications"

  return (
    <aside className={styles.aside}>
      <div className={styles.logo}>
        <img src={logo} alt="ichgram logo" />
      </div>
      <nav>
        <ul className={styles.navList}>
          {navMenu.map(item => (
            <li key={item.title}>
              {item.path ? (
                <NavLink
                  to={item.path}
                  onClick={onClosePanel}
                  className={({ isActive }) =>
                    isActive && !hasActivePanel ? styles.activeLink : styles.link
                  }
                >
                  {({ isActive }) => (
                    <>
                      <img
                        src={isActive && !hasActivePanel ? item.activeIcon : item.icon}
                        alt=""
                      />
                      <span>{item.title}</span>
                    </>
                  )}
                </NavLink>
              ) : (
                <button
                  className={
                    activePanel === item.action ? styles.activeLink : styles.link
                  }
                  onClick={() =>
                    activePanel === item.action
                      ? onClosePanel()
                      : onOpenPanel(item.action)
                  }
                >
                  <img
                    src={activePanel === item.action ? item.activeIcon : item.icon}
                    alt=""
                  />
                  <span>{item.title}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
