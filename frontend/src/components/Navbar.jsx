import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Use Lucide-react for icons

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-3">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <button
          className="sm:hidden text-customGray"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } sm:flex sm:items-center sm:justify-between sm:gap-10 sm:block`}
      >
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-0">
          <Link to="/products/tops" className="text-customGray font-thin text-sm sm:text-base">
            Tops
          </Link>
          <Link to="/products/bottoms" className="text-customGray font-thin text-sm sm:text-base">
            Bottoms
          </Link>
          <Link to="/" className="text-customGray font-thin text-sm sm:text-base">
            Dressers
          </Link>
          <Link to="/" className="text-customGray font-thin text-sm sm:text-base">
            Outer Wear
          </Link>
          <Link to="/" className="text-customGray font-thin text-sm sm:text-base">
            Sleep Wear
          </Link>
          <Link to="/" className="text-customGray font-thin text-sm sm:text-base">
            Under Wear
          </Link>
          <Link to="/" className="text-customGray font-thin text-sm sm:text-base">
            Foot Wear
          </Link>
          <Link to="/" className="text-customGray font-thin text-sm sm:text-base">
            Accessories
          </Link>
          <Link to="/" className="text-customGray font-thin text-sm sm:text-base">
            Special Occasions
          </Link>
          <Link to="/" className="text-customGray font-thin text-sm sm:text-base">
            SportsWear
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Nav;

