import { useState } from "react"
import { useSelector } from "react-redux"
import styles from "./styles.module.css"
import { VITE_SERVER_API_URL } from "../../config/api"
import avatarPlaceholder from "../../assets/icons/avatar-placeholder.png"
import messageAvatarNikiita from "../../assets/icons/message-avatar-nikiita.jpg"
import messageAvatarSashaa from "../../assets/icons/message-avatar-sashaa.jpg"

const mockContacts = [
  {
    _id: "chat-1",
    username: "nikiita",
    avatar: messageAvatarNikiita,
    isFollowing: true,
  },
  {
    _id: "chat-2",
    username: "sashaa",
    avatar: messageAvatarSashaa,
    isFollowing: false,
  },
]

const initialMessages = {
  "chat-1": [
    {
      id: "m-1",
      sender: "them",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: "09:12",
    },
    {
      id: "m-2",
      sender: "me",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: "09:14",
    },
  ],
  "chat-2": [
    {
      id: "m-3",
      sender: "them",
      text: "Hey, saw your last post, looks amazing, keep going.",
      time: "11:03",
    },
  ],
}

function getInitials(name) {
  return (name || "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || "")
    .join("")
}

function getTimeLabel() {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date())
}

export default function Messages() {
  const currentUser = useSelector(state => state.auth.user)
  const [contacts] = useState(mockContacts)
  const [selectedChatId, setSelectedChatId] = useState("")
  const [messagesByUserId, setMessagesByUserId] = useState(initialMessages)
  const [draft, setDraft] = useState("")

  const selectedContact = contacts.find(
    contact => contact._id === selectedChatId,
  )
  const activeMessages = selectedContact
    ? messagesByUserId[selectedContact._id] || []
    : []

  function handleSendMessage(event) {
    event.preventDefault()

    const normalizedDraft = draft.trim()

    if (!selectedContact || !normalizedDraft) return

    const nextMessage = {
      id: `m-${Date.now()}`,
      sender: "me",
      text: normalizedDraft,
      time: getTimeLabel(),
    }

    setMessagesByUserId(currentMessages => ({
      ...currentMessages,
      [selectedContact._id]: [
        ...(currentMessages[selectedContact._id] || []),
        nextMessage,
      ],
    }))
    setDraft("")
  }

  return (
    <main className={styles.messages}>
      <section className={styles.sidebar}>
        <header className={styles.sidebarHeader}>
          <div>
            <p className={styles.eyebrow}>Messages</p>
            <h1>{currentUser?.username || "Inbox"}</h1>
          </div>
        </header>

        {contacts.length === 0 ? (
          <div className={styles.state}>No chats available yet.</div>
        ) : (
          <ul className={styles.chatList}>
            {contacts.map(contact => {
              const isActive = selectedChatId === contact._id
              const previewMessage =
                messagesByUserId[contact._id]?.slice(-1)[0]?.text ||
                (contact.isFollowing || contact.followsYou
                  ? "Ready to start a conversation"
                  : "Say hello")

              return (
                <li key={contact._id}>
                  <button
                    type="button"
                    className={
                      isActive ? styles.chatButtonActive : styles.chatButton
                    }
                    onClick={() => setSelectedChatId(contact._id)}
                  >
                    <img
                      src={contact.avatar}
                      alt={`${contact.username} avatar`}
                      className={styles.avatar}
                    />

                    <div className={styles.chatMeta}>
                      <div className={styles.chatTopLine}>
                        <strong>{contact.username}</strong>
                        {contact.isFollowing && <span>Following</span>}
                      </div>
                      <p>{previewMessage}</p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className={styles.chatPanel}>
        {selectedContact ? (
          <>
            <header className={styles.chatHeader}>
              <div className={styles.chatUser}>
                <img
                  src={selectedContact.avatar}
                  alt={`${selectedContact.username} avatar`}
                  className={styles.chatHeroAvatar}
                />
                <div>
                  <h2>{selectedContact.username}</h2>
                </div>
              </div>
            </header>

            <div className={styles.chatBody}>
              <div className={styles.conversationIntro}>
                <img
                  src={selectedContact.avatar}
                  alt={`${selectedContact.username} avatar`}
                  className={styles.introAvatar}
                />
                <h3>{selectedContact.username}</h3>
                <button type="button" className={styles.viewProfileButton}>
                  View profile
                </button>
              </div>

              {activeMessages.length === 0 ? (
                <div className={styles.emptyConversation}>
                  <div className={styles.emptyBadge}>
                    {getInitials(
                      selectedContact.fullName || selectedContact.username,
                    )}
                  </div>
                  <h3>{selectedContact.username}</h3>
                  <p>Start the conversation...</p>
                </div>
              ) : (
                activeMessages.map(message => (
                  <div
                    key={message.id}
                    className={
                      message.sender === "me"
                        ? styles.messageRowOwn
                        : styles.messageRow
                    }
                  >
                    <div
                      className={
                        message.sender === "me"
                          ? styles.messageBubbleOwn
                          : styles.messageBubble
                      }
                    >
                      <p>{message.text}</p>
                      <span>{message.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form className={styles.composer} onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder={`Message ${selectedContact.username}`}
                value={draft}
                onChange={event => setDraft(event.target.value)}
              />
              <button type="submit" disabled={!draft.trim()}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div className={styles.blankState}>
            <div className={styles.blankCard}>
              <h2>Your messages</h2>
              <p>
                Select a chat on the left. Until then, this area stays white.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
