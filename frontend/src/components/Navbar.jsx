import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react"; // Import X icon from lucide-react

const categories = [
  {
    name: "Outfits",
    subcategories: [
      { name: "Boys Outfits", items: ["Boys Trouser sets", "Boys Short sets", "Trousers", "T-Shirts"] },
      { name: "Girls Outfits", items: ["Girls Trouser set", "Girls Short set", "Skirt set", "Dresses", "Fanay wear", "Trousers", "Tops", "Leggings"] },
      { name: "Swimming Wear", items: ["Boys Costumes", "Girls Costumes"] },
      { name: "Inner Wears", items: ["Vests", "Boxers", "Panties", "Boob Tops"] },
    ],
  },
  {
    name: "Bags",
    subcategories: [
      { name: "School Bags", items: ["3 in 1 Trolley Bag", "3 in 1 Backpack", "2 in 1 Backpack", "Single Backpack"] },
      { name: "Travelling Bags", items: ["3 in 1 Suitcase", "Single Suitcase"] },
      { name: "Girls Handbags", items: [] },
      { name: "Monkey Bags", items: [] },
      { name: "Lunch Bags", items: [] },
    ],
  },
  {
    name: "Shoes",
    subcategories: [
      { name: "Boys' Shoes", items: ["Boys Sneakers", "Converse", "Boys Open Shoes", "Boys School Shoes"] },
      { name: "Girls' Shoes", items: ["Girls Sneakers", "Doll Shoes", "Heels", "Girls Open Shoes", "Girls School Shoes"] },
    ],
  },
  {
    name: "Kids Hygiene",
    subcategories: [
      { name: "Perfumes", items: ["Boys Scents", "Girls Scents"] },
      { name: "Body Mists", items: ["Boys Scents", "Girls Scents"] },
      { name: "Body Wash", items: [] },
      { name: "Lotions", items: [] },
      { name: "Make Up Kit", items: [] },
    ],
  },
  {
    name: "Kids Accessories",
    subcategories: [
      { name: "Watches", items: [] },
      { name: "Hair Accessories", items: [] },
    ],
  },
  {
    name: "Others",
    subcategories: [
      { name: "Pencil Pouches", items: [] },
      { name: "Cosplay Costumes", items: [] },
      { name: "Raincoats", items: [] },
      { name: "Swimming Bags", items: [] },
    ],
  },
];


export default function Nav({ menuOpen, setMenuOpen }) {
  const [openCategory, setOpenCategory] = useState(null);
  const navRef = useRef(null);

  // Close the navbar when clicking outside (for both mobile and desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        if (typeof setMenuOpen === "function") {
          setMenuOpen(false); // Close the mobile sidebar
        }
        setOpenCategory(null); // Close any open category dropdowns
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setMenuOpen]);

  // Close the popup when a subcategory or item is clicked
  const handleLinkClick = () => {
    if (typeof setMenuOpen === "function") {
      setMenuOpen(false);
    }
    setOpenCategory(null);
  };

  return (
    <div className="relative" ref={navRef}>
      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-purple-800 text-white p-4 transition-transform transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } sm:hidden z-50`}
      >
        {/* Close Button (X Icon) */}
        <div className="flex items-left">
          <button onClick={() => setMenuOpen(false)}>
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Categories List */}
        <div className="mt-4 space-y-4 overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-600">
          <ul>
            {categories.map((category, index) => (
              <li key={index}>
                <button
                  onClick={() =>
                    setOpenCategory(openCategory === category.name ? null : category.name)
                  }
                  className="w-full text-left font-semibold hover:bg-gray-700 p-2 rounded transition duration-300"
                >
                  {category.name}
                </button>
                {openCategory === category.name && (
                  <ul className="pl-4 mt-2 text-sm space-y-1">
                    {category.subcategories.map((sub, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={`/subcategories/${sub.name}`}
                          onClick={handleLinkClick}
                          className="text-base border-b pb-1 text-white hover:underline"
                        >
                          {sub.name}
                        </Link>
                        <ul className="pl-4 text-xs">
                          {sub.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link
                                to={`/items/${item}`}
                                onClick={handleLinkClick}
                                className="hover:underline text-lg gap-4 text-primaryOrange"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden sm:flex text-2xl bg-whitesmoke items-center text-purple-800 p-4 space-x-6 justify-center w-full">
        <div className="flex space-x-6">
          {categories.map((category, index) => (
            <div key={index} className="relative flex items-center">
              <button
                onClick={() =>
                  setOpenCategory(openCategory === category.name ? null : category.name)
                }
                className="hover:bg-gray-300 p-2 rounded"
              >
                {category.name}
              </button>
              {openCategory === category.name && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-10 bg-white text-black p-4 rounded shadow-lg z-50 w-auto">
                  <div className="flex gap-6 rounded-lg">
                    {category.subcategories.map((sub, subIndex) => (
                      <div key={subIndex} className="whitespace-nowrap">
                        <Link
                          to={`/subcategories/${sub.name}`}
                          onClick={handleLinkClick}
                          className="hover:bg-green-800 text-lg"
                        >
                          <h3 className="text-base border-b pb-1 text-purple-800">{sub.name}</h3>
                        </Link>
                        <ul className="mt-1 text-sm">
                          {sub.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link
                                to={`/items/${item}`}
                                onClick={handleLinkClick}
                                className="hover:underline text-lg gap-4 text-primaryOrange"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}