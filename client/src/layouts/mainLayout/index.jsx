import { Outlet } from "react-router"
import Aside from "../../components/aside"
import styles from "./styles.module.css"
import { useState } from "react"
import SidePanel from "../../components/sidePannel"

export default function MainLayout() {
  const [activePanel, setActivePanel] = useState(null)
  const hasSidePanel =
    activePanel === "search" || activePanel === "notifications"

  return (
    <div className={styles.layout}>
      <Aside
        activePanel={activePanel}
        onOpenPanel={setActivePanel}
        onClosePanel={() => setActivePanel(null)}
      />

      {hasSidePanel && (
        <>
          <SidePanel panel={activePanel} onClose={() => setActivePanel(null)} />

          <button
            className={styles.overlay}
            onClick={() => setActivePanel(null)}
          />
        </>
      )}

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
