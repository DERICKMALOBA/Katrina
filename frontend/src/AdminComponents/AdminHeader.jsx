import { MessageCircle, Bell } from "lucide-react";
import { useState, useEffect } from "react";

const AdminProfile = () => {
  const [imageUrl, setImageUrl] = useState("/uploads/default-avatar.png"); // Default avatar URL

  // Fetch the current avatar from the backend
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch("/api/admin/get-avatar"); // Endpoint to get current avatar
        const result = await response.json();
        if (result.avatarUrl) {
          setImageUrl(result.avatarUrl); // Set avatar URL if found
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    fetchAvatar();
  }, []); // This will only run once when the component is mounted

  // Handle image change from file picker
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
      {/* Avatar Image */}
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
          <MessageCircle size={24} className="text-white gap-3" />
          {/* You can add a badge here if needed */}
        </div>

        {/* Notification Icon */}
        <div className="relative">
          <Bell size={24} className="text-white gap-4" />
          {/* You can add a badge here if needed */}
        </div>

        {/* Admin Profile (Avatar, Admin Name) */}
        <div className="flex items-center space-x-2 gap-4">
          <AdminProfile />
          <span className="text-white hidden sm:block">Admin Name</span>
        </div>
      </div>

      {/* Mobile version of Admin Profile (Avatar Only) */}
      <div className="md:hidden flex items-center space-x-4">
        <AdminProfile />
      </div>
    </header>
  );
};

export default AdmiHeader;
