import { useState, useEffect, useRef } from "react";
import { useSelector } from 'react-redux';
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const AdminMessagePanel = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [conversations, setConversations] = useState([]);
  const user = useSelector((state) => state.auth.user);

  // Fetch all messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/messages/messageslist");
        if (!response.ok) throw new Error("Error fetching messages");
        const data = await response.json();
        setMessages(data);
        
        // Group messages by email to create conversations
        const uniqueConversations = data.reduce((acc, message) => {
          if (!acc.some(conv => conv.email === message.email)) {
            acc.push({
              email: message.email,
              name: message.name,
              lastMessage: message.message,
              timestamp: message.createdAt
            });
          }
          return acc;
        }, []);
        
        setConversations(uniqueConversations);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, []);

  const handleBackToConversations = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Admin Messages</h1>
      
      {selectedMessage ? (
        <MessageConversation 
          email={selectedMessage} 
          onBack={handleBackToConversations}
          userName={conversations.find(c => c.email === selectedMessage)?.name}
        />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {conversations.map((conversation, index) => (
                <tr key={conversation.email} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {conversation.name} ({conversation.email})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {conversation.lastMessage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setSelectedMessage(conversation.email)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      View Conversation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {conversations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No messages available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MessageConversation = ({ email, onBack, userName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initialdata = { Useremail: email, Email: user.email };
    socket.emit("registeradmin", initialdata);

    socket.on("useradmin", (data) => {
      setMessages(data);
    });

    socket.on("receiverbyadmin", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("sendbacktoadmin", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("useradmin");
      socket.off("receiverbyadmin");
      socket.off("sendbacktoadmin");
    };
  }, [email, user.email]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const setMessage = (e) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const messageData = { 
      Useremail: email, 
      Name: user.name, 
      text: newMessage, 
      Email: user.email, 
      Role: user.role 
    };
    
    socket.emit("sendtouser", messageData);
    setNewMessage("");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-4">
        <button 
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-lg font-bold">Conversation with {userName} ({email})</h2>
      </div>
      
      <div className="h-96 overflow-y-auto border p-4 rounded bg-gray-50">
        {messages.map((msg, index) => {
          const isAdmin = msg.email === user.email;

          return (
            <div
              key={index}
              className={`flex ${isAdmin ? "justify-end" : "justify-start"} mb-3`}
            >
              <div
                className={`p-3 rounded-lg max-w-[80%] ${
                  isAdmin ? "bg-blue-100 text-black" : "bg-gray-200 text-black"
                }`}
              >
                <div className="font-semibold">{isAdmin ? "You" : msg.name}</div>
                <div>{msg.msg}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.time|| new Date()).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="flex mt-4">
        <input
          type="text"
          className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={newMessage}
          onChange={setMessage}
        />
        <button 
          type="submit" 
          className="p-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AdminMessagePanel;