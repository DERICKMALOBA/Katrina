import { FaSearch } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import { FaShoppingCart } from "react-icons/fa";
import { Link} from 'react-router-dom';
import { useState} from 'react';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearchClick = () => {
    const urlParams = new URLSearchParams();
    if (searchTerm) urlParams.set('searchTerm', searchTerm);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };
  return (
    <header className="bg-primaryOrange sticky top-0 z-10 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 gap-10">
        {/* Logo Section - Left */}
        <Link to='/'>
          <h1 className="font-bold text-sm sm:text-xl flex gap-2">
            <span className="text-white">Katrina Kids' Closet</span>
          </h1>
        </Link>

        {/* Search Input - Center */}
        <div className="bg-slate-300 p-4 rounded-2xl flex items-center w-full max-w-md mx-auto">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search by an item..." 
              className="bg-transparent focus:outline-none size-5 w-full sm:w-64 pl-4 pr-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
              onKeyDown={handleKeyPress}  // Trigger search on Enter key press
            />
            <FaSearch 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 text-2xl cursor-pointer"
              onClick={handleSearchClick} 
            />
          </div>
        </div>
        <FaUserCircle size={30} color="gray" />
        {/* Links Section - Right */}
        <ul className="flex gap-4">
          <li className="hover:opacity-70 active:text-green-500 transition duration-200">
            <Link to='/'>HELP?</Link>
          </li>
          <FaShoppingCart size={24} className="text-gray-600" />
        </ul>
      </div>
    </header>
  );
}

export default Header;
