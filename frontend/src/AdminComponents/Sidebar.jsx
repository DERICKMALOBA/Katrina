import {
	BarChart2,
	DollarSign,
	Menu,
	ShoppingBag,
	ShoppingCart,
	TrendingUp,
	Users,
	Tag,
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
	{ name: "Analytics", icon: TrendingUp, href: "/analytics" },
	{ name: "Offers", icon: Tag, href: "/offers" },
	
  ];
  
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
		<div className="h-full bg-primaryBlack p-4 flex flex-col border-r border-gray-700">
		  {/* Sidebar Toggle Button */}
		  <motion.button
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
			onClick={() => setIsSidebarOpen(!isSidebarOpen)}
			className="p-2 rounded-full hover:bg-primaryBlue transition-colors max-w-fit"
		  >
			<Menu size={24} className="text-white" />
		  </motion.button>
  
		  {/* Logo */}
		  <div className="flex items-center space-x-2 mb-8 mt-4">
			<img src="/path-to-logo.png" alt="Logo" className="w-8 h-8" />
			{isSidebarOpen && (
			  <span className="text-lg font-semibold text-white">
				Admin Panel
			  </span>
			)}
		  </div>
  
		  {/* Navigation Items */}
		  <nav className="mt-8 flex-grow">
			{SIDEBAR_ITEMS.map((item) => (
			  <motion.div key={item.href} className="relative group">
				<Link to={item.href}>
				  <motion.div
					className={`flex items-center p-4 text-sm font-medium rounded-lg mb-2 transition-colors ${
					  location.pathname === item.href
						? "bg-primaryBlue text-white"
						: "hover:bg-primaryBlue text-gray-300"
					}`}
				  >
					<item.icon
					  size={24} // Larger icon size
					  className="text-white" // Set icon color to white
					/>
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
				{/* Tooltip for Collapsed Sidebar */}
				{!isSidebarOpen && (
				  <motion.div
					className="absolute left-16 bg-primaryBlue text-gray-100 px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
				  >
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
  