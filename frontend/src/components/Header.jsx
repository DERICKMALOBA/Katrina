import { FaSearch, FaTimes } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import { FaShoppingCart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useState, useRef, useEffect } from 'react';
import { Menu } from "lucide-react";
import Nav from './Navbar';
// import { fetchSearchResults } from '../Redux/SearchSlice';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const user = useSelector((state) => state.auth.user);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearchClick = async () => {
    if (searchTerm.trim()) {
      // Construct the URL with search parameters
      const searchParams = new URLSearchParams({ name: searchTerm });
      const url = `/products/search?${searchParams.toString()}`;

      // Dispatch the thunk to fetch search results
      // await dispatch(fetchSearchResults({ name: searchTerm }));

      // Navigate to the search results page with the updated URL
      navigate(url);
    }
  };

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter' && searchTerm.trim()) {
      // Construct the URL with search parameters
      const searchParams = new URLSearchParams({ name: searchTerm });
      const url = `/products/search?${searchParams.toString()}`;

      // Dispatch the thunk to fetch search results
      // await dispatch(fetchSearchResults({ name: searchTerm }));

      // Navigate to the search results page with the updated URL
      navigate(url);
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-purple-800 sticky top-0 z-10 shadow-md">
      {/* Small Devices: Stacked Layout */}
      <div className="sm:hidden flex flex-col p-3 gap-4">
        {/* First Row: Menu Icon, Logo, Profile Icon, and Cart Icon */}
        <div className="flex justify-between items-center">
          {/* Menu Icon - Left */}
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>

          {/* Logo Section - Center */}
          <Link to='/' className="flex-grow text-center">
            <h1 className="font-bold text-lg sm:text-xl">
              <span className="text-white">Katrina Kid's Closet</span>
            </h1>
          </Link>

          {/* Icons Section - Right */}
          <div className="flex items-center gap-4">
            {/* User Icon or Sign-In Link */}
            {user ? (
              <Link to='/profile'>
                <div className="relative">
                  <FaUserCircle size={30} color="white" />
                </div>
              </Link>
            ) : (
              <Link to="/sign-in" className="text-white hover:opacity-70 transition duration-200">
                Sign in
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <FaShoppingCart size={28} className="text-white hover:text-green-600 transition duration-200" />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Second Row: Search Input */}
        <div className="w-full">
          <div className="bg-slate-300 size-10 p-4 rounded-2xl flex items-center w-full">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search by an item..." 
                className="bg-transparent focus:outline-none size-5 w-full pl-4 pr-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyDown={handleKeyPress}
              />
              <FaSearch 
                className="absolute right-2 size-6 top-1/2 transform -translate-y-1/2 text-gray-600 text-2xl cursor-pointer"
                onClick={handleSearchClick} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Larger and Medium Devices: Original Layout */}
      <div className="hidden sm:flex justify-between items-center max-w-6xl mx-auto p-3 gap-10">
        {/* Logo Section - Left */}
        <Link to='/'>
          <h1 className="font-bold text-sm sm:text-xl flex gap-2">
            <span className="text-white">Katrina Kids Closet</span>
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
              onKeyDown={handleKeyPress}
            />
            <FaSearch 
              className="absolute right-2 size-6 top-1/2 transform -translate-y-1/2 text-gray-600 text-2xl cursor-pointer"
              onClick={handleSearchClick} 
            />
          </div>
        </div>

        {/* User Icon or Sign-In Link */}
        {user ? (
          <Link to='/profile'>
            <div className="relative">
              <FaUserCircle size={30} color="white" />
            </div>
          </Link>
        ) : (
          <Link to="/sign-in" className="text-white hover:opacity-70 transition duration-200">
            Sign In
          </Link>
        )}

        {/* Links Section - Right */}
        <ul className="flex gap-6 items-center relative">
          <li className="text-white hover:opacity-70 active:text-white transition duration-200">
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

      {/* Navbar Component - Only for Small Screens */}
      {menuOpen && (
        <div className="sm:hidden" ref={menuRef}>
          <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </div>
      )}
    </header>
  );
}

export default Header;