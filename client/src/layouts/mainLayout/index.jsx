import { Outlet } from "react-router"
import Aside from "../../components/aside"
import styles from "./styles.module.css"
import { useState } from "react"
import SidePanel from "../../components/sidePannel"
import Modal from "../../components/modal"
import CreatePostModal from "../../components/createPostModal"

export default function MainLayout() {
  const [activePanel, setActivePanel] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const hasSidePanel =
    activePanel === "search" || activePanel === "notifications"

  function handleOpenPanel(action) {
    if (action === "create") {
      setIsCreateModalOpen(true)
      return
    }

    setActivePanel(action)
  }

  return (
    <div className={styles.layout}>
      <Aside
        activePanel={activePanel}
        onOpenPanel={handleOpenPanel}
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

      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreatePostModal onSuccess={() => setIsCreateModalOpen(false)} />
        </Modal>
      )}

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
