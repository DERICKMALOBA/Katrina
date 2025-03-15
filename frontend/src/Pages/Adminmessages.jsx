import { useState, useEffect, useRef } from "react";
import { useSelector } from 'react-redux';
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const AdminMessagePanel = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch all messages
  useEffect(() => {
    fetch("/api/messages/messageslist")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));
  }, []);

  const handleMessageClick = (email) => {
    setSelectedMessage(email);
  };

  // Close the Admin component when clicking outside
  const adminRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setSelectedMessage(null); // Close the Admin component
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Messages</h2>
      <div style={styles.messagesContainer}>
        {messages.map((msg) => (
          <div key={msg.id} style={styles.messageCard} onClick={() => handleMessageClick(msg.email)}>
            <p style={styles.userMessage}>
              <strong>{msg.name}</strong>
            </p>
          </div>
        ))}
      </div>
      {selectedMessage && (
        <div ref={adminRef}>
          <Admin email={selectedMessage} />
        </div>
      )}
    </div>
  );
};

const Admin = ({ email }) => {
  const [messages, setMessages] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [newMessage, setNewMessage] = useState("");

  const initialdata = { Useremail: email, Email: user.email };
  socket.emit("registeradmin", initialdata);

  socket.on("useradmin", (data) => {
    setMessages(data);
  });

  useEffect(() => {
    socket.on("receiverbyadmin", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);

  function setMessage(e) {
    setNewMessage(e.target.value);
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    const messageData = { Useremail: email, Name: user.name, text: newMessage, Email: user.email, Role: user.role };
    socket.emit("sendtouser", messageData);
    setNewMessage("");
  };

  socket.on("sendbacktoadmin", (data) => {
    setMessages((prev) => [...prev, data]);
  });

  return (
    <div className="fixed bottom-10 right-10 w-80 bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-bold mb-2">Messages</h2>
      <div className="h-40 overflow-y-auto border p-2 rounded">
        {messages.map((msg) => {
          const Admin = msg.email === user.email;

          return (
            <div
              key={msg.id}
              className={`flex ${Admin ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 my-1 rounded max-w-[70%] ${
                  Admin ? "bg-blue-200 text-black" : "bg-gray-200 text-black"
                }`}
              >
                {msg.msg}
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={sendMessage} className="flex mt-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l"
          placeholder="Type a message..."
          value={newMessage}
          onChange={setMessage}
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-r">
          Send
        </button>
      </form>
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
    cursor: "pointer",
  },
  userMessage: {
    fontSize: "16px",
    color: "#333",
  },
};

export default AdminMessagePanel;