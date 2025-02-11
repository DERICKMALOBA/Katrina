import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const AdminMessagePanel = () => {
  const [messages, setMessages] = useState([]);
  const [replyMessageId, setReplyMessageId] = useState(null);
  const [adminReply, setAdminReply] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReplySent, setIsReplySent] = useState(false); // New state to track if reply was sent

  // Fetch all messages
  useEffect(() => {
    fetch("/api/messages/messageslist")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));

    // Listen for incoming messages
    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [message, ...prevMessages]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  // Send admin reply
  const sendReply = async () => {
    if (!adminReply.trim() || !replyMessageId) return;

    const response = await fetch("/api/messages/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId: replyMessageId, adminReply }),
    });

    if (response.ok) {
      const updatedMessage = await response.json();
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === updatedMessage.id ? updatedMessage : msg
        )
      );
      setReplyMessageId(null); // Clear the replyMessageId
      setAdminReply(""); // Clear the adminReply text
      setIsReplySent(true); // Set the reply sent flag to true
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Messages</h2>
      <div style={styles.messagesContainer}>
        {messages.map((msg) => (
          <div key={msg.id} style={styles.messageCard}>
            <p style={styles.userMessage}>
              <strong>{msg.name}:</strong> {msg.customermsg}
            </p>
            {msg.adminmsg && <p style={styles.adminMessage}><strong>Admin:</strong> {msg.adminmsg}</p>}
            {!msg.replied && (
              <button
                onClick={() => {
                  setReplyMessageId(msg.id);
                  setIsModalOpen(true);
                  setIsReplySent(false);
                }}
                style={styles.replyButton}
              >
                Reply
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal Popup for Reply */}
      {isModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h3 style={modalStyles.modalHeader}>Reply to Message</h3>

            {!isReplySent ? (
              <>
                <textarea
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  placeholder="Type your reply"
                  rows="4"
                  style={modalStyles.textarea}
                />
                <div style={modalStyles.buttonContainer}>
                  <button onClick={sendReply} style={modalStyles.sendButton}>
                    Send Reply
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    style={modalStyles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <p style={modalStyles.successMessage}>Reply Sent! Thank you for your response.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Main container styling
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f7f9fc",
    borderRadius: "8px",
    maxWidth: "900px",
    margin: "auto",
  },
  heading: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  messagesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  messageCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  userMessage: {
    fontSize: "16px",
    color: "#333",
  },
  adminMessage: {
    fontSize: "16px",
    color: "#555",
    marginTop: "10px",
  },
  replyButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "14px",
    transition: "background-color 0.3s",
  },
  replyButtonHover: {
    backgroundColor: "#45a049",
  },
};

// Modal styles
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    animation: "fadeIn 0.3s ease-out",
  },
  modalHeader: {
    fontSize: "20px",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    fontSize: "14px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  successMessage: {
    fontSize: "16px",
    color: "#4CAF50",
    textAlign: "center",
  },
};

export default AdminMessagePanel;

