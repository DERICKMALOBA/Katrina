import {  MessageCircle, Bell } from "lucide-react";


const AdmiHeader = () => {
 

  return (
    <header className="flex items-center justify-between bg-transparent  p-4 shadow-md">
      {/* Logo and Business Name */}
      <div className="flex items-center space-x-4">
  <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-wide ">
    KATRINA CHILDREN CLOSET
  </div>
</div>


      {/* Search Input */}
      {/* <div className="relative max-w-xs w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full p-2 pl-10 pr-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryBlue"
        />
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
      </div> */}

      {/* Icons (Message, Notification, Avatar, Admin Name) */}
      <div className="flex items-center space-x-6">
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

        {/* Admin Avatar and Name */}
        <div className="flex items-center space-x-2 gap-4">
          <img
            src="/path-to-avatar.png"
            alt="Admin Avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-white">Admin Name</span>
        </div>
      </div>
    </header>
  );
};

export default AdmiHeader;
