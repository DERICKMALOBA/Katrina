import { MessageCircle, Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSelector } from 'react-redux';
import io from "socket.io-client";
const socket = io("http://localhost:5000");
import AdminMessagePanel from "../Pages/Adminmessages";
import Sound from "../public/notify.m4a";
import Stock from "../public/stock.mp3";
import NotificationsPage from "../Pages/notifications";
import AdminProfile from "./AdminProfile";

const AdmiHeader = () => {
  const [total, setTotal] = useState("");
  const [totall, setTotall] = useState('');
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
   const user = useSelector((state) => state.auth.user);

  // Ref for the NotificationsPage component
  const notificationsRef = useRef(null);

  useEffect(() => {
    socket.on("adminnotifications", (data) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const sound = new Audio(Sound);
      const track = audioContext.createMediaElementSource(sound);
      track.connect(audioContext.destination);
      sound.play().catch(err => console.error("Audio error:", err));
      setTotal(data.Total);
    });
  }, []);

  useEffect(() => {
    socket.on("stocknotify", (data) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const sound = new Audio(Stock);
      const track = audioContext.createMediaElementSource(sound);
      track.connect(audioContext.destination);
      sound.play().catch(err => console.error("Audio error:", err));
      setTotall(data);
    });
  }, []);

  // Close NotificationsPage when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the notificationsRef
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false); // Close the NotificationsPage
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMessages = () => {
    setShowMessages(!showMessages);
    setShowNotifications(false); // Ensure notifications are hidden when messages are shown
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowMessages(false); // Ensure messages are hidden when notifications are shown
  };

  return (
    <header className="flex items-center justify-between bg-transparent p-4 shadow-md">
      {/* Logo and Business Name */}
      <div className="flex items-center space-x-4">
        <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-wide">
          KATRINA KIDS' CLOSET
        </div>
      </div>

      {/* Icons (Message, Notification, Avatar, Admin Profile) */}
      <div className="hidden md:flex items-center space-x-6">
        {/* Message Icon */}
        <div className="relative">
          <div onClick={toggleMessages} className="cursor-pointer">
            <MessageCircle size={24} className="text-white gap-3" />
            {total > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md">
                {total}
              </span>
            )}
          </div>
          {showMessages && <AdminMessagePanel />}
        </div>

        {/* Notification Icon */}
        <div className="relative">
          <div onClick={toggleNotifications} className="cursor-pointer">
            <Bell size={24} className="text-white gap-4" />
            {totall > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md">
                {totall}
              </span>
            )}
          </div>
          {/* Attach the ref to the NotificationsPage container */}
          {showNotifications && (
            <div ref={notificationsRef}>
              <NotificationsPage />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 gap-4">
          <AdminProfile />
          <span className="text-white hidden sm:block">{user.name}</span>
        </div>
      </div>
      <div className="md:hidden flex items-center space-x-4">
        <AdminProfile />
      </div>
    </header>
  );
};

export default AdmiHeader;