import {
  BarChart2,
  DollarSign,
  Menu,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
  Tag,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: BarChart2, href: "/overview" },
  { name: "Products", icon: ShoppingBag, href: "/products" },
  { name: "Customers", icon: Users, href: "/customers" },
  { name: "Sales", icon: DollarSign, href: "/sales" },
  { name: "Orders", icon: ShoppingCart, href: "/orders" },
  { name: "Offers", icon: Tag, href: "/offers" },
  { name: "Analytics", icon: TrendingUp, href: "/analytics" },
];

const DELIVERY_VEHICLE_ITEM = {
  name: "Delivery Vehicle",
  icon: Truck,
  href: "/edit-delivery",
  isButton: true,
};

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-screen bg-[#1f2121] p-4 pt-10 flex flex-col border-r border-gray-700 overflow-y-auto">
        {/* Sidebar Toggle Button - Always visible */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-primaryBlue transition-colors max-w-fit mb-4"
        >
          <Menu size={24} className="text-white" />
        </motion.button>

        {/* Logo - Only shown when expanded */}
        {isSidebarOpen && (
          <div className="flex items-center space-x-2 mb-4">
            <img src="/path-to-logo.png" alt="Logo" className="w-8 h-8" />
            <span className="font-semibold text-white">Admin Panel</span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-grow space-y-2">
          {/* Delivery Vehicle Button */}
          <motion.div className="relative group">
            <Link to={DELIVERY_VEHICLE_ITEM.href}>
              <motion.div
                className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === DELIVERY_VEHICLE_ITEM.href
                    ? "bg-black text-white border border-gray-600"
                    : " hover:bg-blue-400 text-white"
                } justify-center`} // Always center icon
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <DELIVERY_VEHICLE_ITEM.icon size={24} className="text-white" />
                {isSidebarOpen && (
                  <motion.span
                    className="ml-4 whitespace-nowrap"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    {DELIVERY_VEHICLE_ITEM.name}
                  </motion.span>
                )}
              </motion.div>
            </Link>
            {!isSidebarOpen && (
              <motion.div className="absolute left-full ml-2 bg-[#1f2121] text-gray-100 px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {DELIVERY_VEHICLE_ITEM.name}
              </motion.div>
            )}
          </motion.div>

          {/* Regular Navigation Items */}
          {SIDEBAR_ITEMS.map((item) => (
            <motion.div key={item.href} className="relative group">
              <Link to={item.href}>
                <motion.div
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? "bg-black text-white border border-gray-600"
                      : "hover:bg-[#2d2f2f] text-gray-300"
                  } justify-center`} // Always center icon
                >
                  <item.icon size={24} className="text-white" />
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
              {!isSidebarOpen && (
                <motion.div className="absolute left-full ml-2 bg-[#1f2121] text-gray-100 px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.name}
                </motion.div>
              )}
            </motion.div>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;