import { MessageCircle, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Add this import
import io from "socket.io-client";
const socket = io("http://localhost:5000");
import Sound from "../public/notify.m4a";
import Stock from "../public/stock.mp3";
import AdminProfile from "./AdminProfile";

const AdmiHeader = () => {
  const [total, setTotal] = useState("");
  const [totall, setTotall] = useState('');
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate(); // Initialize navigate function

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

  const handleMessagesClick = () => {
    navigate('/adminmessages'); // Redirect to messages page
  };

  const handleNotificationsClick = () => {
    navigate('/notify'); // Redirect to notifications page
  };

  return (
    <header className="flex items-center justify-between bg-[#1f2121] p-4 shadow-md">
      {/* Logo and Business Name */}
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl md:text-2xl lg:text-3xl text-center font-extrabold text-white uppercase tracking-wide">
          KATRINA KIDS' CLOSET
        </h1>
      </div>

      {/* Icons (Message, Notification, Avatar, Admin Profile) */}
      <div className="hidden md:flex items-center space-x-6">
        {/* Message Icon */}
        <div className="relative">
          <div onClick={handleMessagesClick} className="cursor-pointer">
            <MessageCircle size={24} className="text-white gap-3" />
            {total > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md">
                {total}
              </span>
            )}
          </div>
        </div>

        {/* Notification Icon */}
        <div className="relative">
          <div onClick={handleNotificationsClick} className="cursor-pointer">
            <Bell size={24} className="text-white gap-4" />
            {totall > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md">
                {totall}
              </span>
            )}
          </div>
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