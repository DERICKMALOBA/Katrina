import { useState,useEffect} from "react";
import { useParams,} from "react-router-dom";
import { useSelector } from 'react-redux';
import io from "socket.io-client";
const socket = io("http://localhost:5000");
const Admin = () =>{
  const [messages, setMessages] = useState([]);
  const user = useSelector((state) => state.auth.user);
    const { email } = useParams();
    const [newMessage, setNewMessage] = useState("");;
    const initialdata={Useremail:email,Email:user.email};
       socket.emit("registeradmin",(initialdata));
       socket.on("useradmin",(data)=>{
        setMessages(data);
       });
    useEffect(()=>{
      socket.on("receiverbyadmin",(data)=>{
        setMessages((prev) => [...prev, data]);
  });
});
    function setMessage(e){
      setNewMessage(e.target.value);
    }
  const sendMessage = async (e) => {
    e.preventDefault();
    const messageData = {Useremail:email,Name:user.name, text: newMessage,Email:user.email,Role:user.role};
      socket.emit("sendtouser",messageData);
      setNewMessage(""); 
  };
    socket.on("sendbacktoadmin",(data)=>{
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
export default Admin;