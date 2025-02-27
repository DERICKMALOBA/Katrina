import { FaSearch } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link} from 'react-router-dom';
import { useState} from 'react';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  
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
    <header className="bg-purple-800 sticky top-0 z-10 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 gap-10">
        {/* Logo Section - Left */}
        <Link to='/'>
          <h1 className="font-bold text-sm sm:text-xl flex gap-2">
            <span className="text-white">Katrina Kids  Closet</span>
          </h1>
        </Link>

        {/* Search Input - Center */}
        <div className="bg-slate-300 size-10 p-4 rounded-2xl flex items-center w-full max-w-md mx-auto">
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
              className="absolute right-2 size-6 top-1/2 transform -translate-y-1/2 text-gray-600 text-2xl cursor-pointer"
              onClick={handleSearchClick} 
            />
          </div>
        </div>
        <FaUserCircle size={30} color="white" />
        {/* Links Section - Right */}
        <ul className="flex gap-6 items-center relative">
      <li className=" text-white  hover:opacity-70 active:text-white transition duration-200">
        <Link to="/">HELP?</Link>
      </li>

      <Link to="/cart" className="relative">
        <FaShoppingCart size={28} className="text-white hover:text-green-600 transition duration-200" />
        
        {totalQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md">
            {totalQuantity}
          </span>
        )}
      </Link>
    </ul>
      </div>
    </header>
  );
}

export default Header;
