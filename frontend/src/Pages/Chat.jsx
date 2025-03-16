import { useState,useEffect} from "react";
import { useSelector } from 'react-redux';
import io from "socket.io-client";
const socket = io("http://localhost:5000");
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  var email=user.email;
    socket.emit("register",email);
    socket.on("usermessages",(data)=>{
      setMessages(data);
});
  useEffect(()=>{
    socket.on("receiverbyuser",(data)=>{
      setMessages((prev) => [...prev, data]);
});
  },[]);
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = { text: newMessage,sender:user.name,Email:user.email,Role:user.role};
     socket.emit("sendtoadmin",messageData);
     setNewMessage("");
  };
  socket.on("sendbacktouser",(data)=>{
    setMessages((prev) => [...prev, data]);
});
return (
  <div className="fixed bottom-10 right-10 w-80 bg-white shadow-lg rounded-lg p-4">
    <h2 className="text-lg font-bold mb-2">Messages</h2>
    <div className="h-40 overflow-y-auto border p-2 rounded">
      {messages.map((msg) => {
        const Client = msg.email === user.email;

        return (
          <div
            key={msg.id}
            className={`flex ${Client ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-2 my-1 rounded max-w-[70%] ${
                Client ? "bg-blue-200 text-black" : "bg-gray-200 text-black"
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
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded-r">
        Send
      </button>
    </form>
</div>
);
};

export default Chat;
