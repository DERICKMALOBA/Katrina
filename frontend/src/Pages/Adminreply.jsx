import { useState, useEffect } from "react";
import { useParams,} from "react-router-dom";
const Admin = () => {
  const [messages, setMessages] = useState([]);
    const { email } = useParams();
    const [newMessage, setNewMessage] = useState("");
  // Fetch all messages
  useEffect(() => {
    fetch(`/api/messages/messageslist/${email}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));
  }, []);
    function setMessage(e){
      setNewMessage(e.target.value);
    }
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    alert(newMessage);
    const messageData = {messageEmail:email, text: newMessage };

    const response = await fetch("api/messages/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData),
    });

    if (response.ok) {
      const newMsg = await response.json();
      setMessages([newMsg, ...messages]);
      setNewMessage("");
    }
  };
  return (
    <div className="fixed bottom-10 right-10 w-80 bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-bold mb-2">Messages</h2>
      <div className="h-40 overflow-y-auto border p-2 rounded">
        {messages.map((msg) => (
          <div key={msg.id} className="p-2 bg-gray-100 my-1 rounded">
            <strong>{msg.name}: </strong> {msg.customermsg}
            <strong>Admin: </strong> {msg.adminmsg}
          </div>
        ))}
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

export default Admin;
