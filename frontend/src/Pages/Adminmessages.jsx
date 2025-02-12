import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const AdminMessagePanel = () => {
  const [messages, setMessages] = useState([]);
  // Fetch all messages
  useEffect(() => {
    fetch("/api/messages/messageslist")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Messages</h2>
      <div style={styles.messagesContainer}>
        {messages.map((msg) => (
          <div key={msg.id} style={styles.messageCard}>
            <p style={styles.userMessage}>
            <Link to={`/message/${msg.id}`}>
              <strong>{msg.name}:</strong>
              </Link>
            </p>
          </div>
        ))}
      </div>
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
export default AdminMessagePanel;

