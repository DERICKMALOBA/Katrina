import { MessageCircle, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
const socket = io("http://localhost:5000");
import AdminMessagePanel from "../Pages/Adminmessages";
import Sound from "../public/notify.m4a";
import Stock from "../public/stock.mp3";
import NotificationsPage from "../Pages/notifications";
const AdminProfile = () => {
  const [imageUrl, setImageUrl] = useState("/uploads/default-avatar.png");
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch("/api/admin/get-avatar");
        const result = await response.json();
        if (result.avatarUrl) {
          setImageUrl(result.avatarUrl); // Set avatar URL if found
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    fetchAvatar();
  }, []);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);

      // Upload the selected image to the backend
      fetch("/api/admin/upload-avatar", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setImageUrl(data.imageUrl); // Update the avatar with the new image URL
          }
        })
        .catch((error) => {
          console.error("Image upload failed:", error);
        });
    }
  };

  return (
    <div className="flex items-center space-x-2 gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id="upload-avatar"
      />
      <label htmlFor="upload-avatar">
        <img
          src={imageUrl}
          alt="Admin Avatar"
          className="w-12 h-12 rounded-full cursor-pointer transition-all duration-300 hover:opacity-80"
        />
      </label>
    </div>
  );
};

const AdmiHeader = () => {
  const[total,setTotal]=useState("");
  const[totall,setTotall]=useState('');
  useEffect(() => {
    socket.on("adminnotifications", (data) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const sound = new Audio(Sound);
        const track = audioContext.createMediaElementSource(sound);
        track.connect(audioContext.destination);
        sound.play().catch(err => console.error("Audio error:", err));
     setTotal(data.Total);
    });
  });
  useEffect(() => {
    socket.on("stocknotify", (data) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const sound = new Audio(Stock);
        const track = audioContext.createMediaElementSource(sound);
        track.connect(audioContext.destination);
        sound.play().catch(err => console.error("Audio error:", err));
     setTotall(data);
    });
  });
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
          <Link to="/adminmessages" element={<AdminMessagePanel/>}>
          <MessageCircle size={24}  className="text-white gap-3" />
          {total> 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md">
            {total}
          </span>
        )}
          </Link>
        </div>

        {/* Notification Icon */}
        <div className="relative">
        <Link to="/notify" element={<NotificationsPage/>}>
          <Bell size={24} className="text-white gap-4" />
          {totall> 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md">
            {totall}
          </span>
        )}
        </Link>
        </div>
        <div className="flex items-center space-x-2 gap-4">
          <AdminProfile />
          <span className="text-white hidden sm:block">Admin Name</span>
        </div>
      </div>
      <div className="md:hidden flex items-center space-x-4">
        <AdminProfile />
      </div>
    </header>
  );
};

export default AdmiHeader;
