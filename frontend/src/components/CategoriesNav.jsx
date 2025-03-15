// import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { Menu, X } from "lucide-react";

// const categories = [
//   {
//     name: "Outfits",
//     subcategories: [
//       { name: "Boys Outfits", items: ["Trouser sets", "Short sets", "Trousers", "T-Shirts"] },
//       { name: "Girls Outfits", items: ["Trouser set", "Short set", "Skirt set", "Dresses", "Fancy wear", "Trousers", "Tops", "Leggings"] },
//       { name: "Swimming Wear", items: ["Boys Costumes", "Girls Costumes"] },
//       { name: "Inner Wears", items: ["Vests", "Boxers", "Panties", "Boob Tops"] },
//     ],
//   },
//   {
//     name: "Bags",
//     subcategories: [
//       { name: "School Bags", items: ["3 in 1 Trolley Bag", "3 in 1 Backpack", "2 in 1 Backpack", "Single Backpack"] },
//       { name: "Travelling Bags", items: ["3 in 1 Suitcase", "Single Suitcase"] },
//       { name: "Girls Handbags", items: [] },
//       { name: "Monkey Bags", items: [] },
//       { name: "Lunch Bags", items: [] },
//     ],
//   },
//   {
//     name: "Shoes",
//     subcategories: [
//       { name: "Boys' Shoes", items: ["Sneakers", "Converse", "Open Shoes", "School Shoes"] },
//       { name: "Girls' Shoes", items: ["Sneakers", "Doll Shoes", "Heels", "Open Shoes", "School Shoes"] },
//     ],
//   },
//   {
//     name: "Kids Hygiene",
//     subcategories: [
//       { name: "Perfumes", items: ["Boys Scents", "Girls Scents"] },
//       { name: "Body Mists", items: ["Boys Scents", "Girls Scents"] },
//       { name: "Body Wash", items: [] },
//       { name: "Lotions", items: [] },
//     ],
//   },
//   {
//     name: "Kids Accessories",
//     subcategories: [
//       { name: "Watches", items: [] },
//       { name: "Hair Accessories", items: [] },
//     ],
//   },
//   {
//     name: "Others",
//     subcategories: [
//       { name: "Pencil Pouches", items: [] },
//       { name: "Cosplay Costumes", items: [] },
//       { name: "Raincoats", items: [] },
//       { name: "Swimming Bags", items: [] },
//       { name: "Makeup Kit", items: [] },
//     ],
//   },
// ];

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [openCategory, setOpenCategory] = useState(null);
//   const menuRef = useRef(null);
//   const dropdownRef = useRef(null);

//   // Close sidebar when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMenuOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutsideDropdown(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpenCategory(null);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutsideDropdown);
//     return () => document.removeEventListener("mousedown", handleClickOutsideDropdown);
//   }, []);

//   return (
//     <div className="relative">
//       {/* Mobile Menu Button */}
//       <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
//         <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
//           {menuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Sidebar for Mobile */}
//       <div
//         ref={menuRef}
//         className={`fixed inset-y-0 left-0 w-64 bg-blue-600 text-white p-4 transition-transform transform ${
//           menuOpen ? "translate-x-0" : "-translate-x-full"
//         } sm:hidden z-50`}
//       >
//         <ul className="mt-10 space-y-4">
//           {categories.map((category, index) => (
//             <li key={index} className="items">
//               <button
//                 onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
//                 className="w-full text-left  font-semibold hover:bg-blue-700 p-2 rounded"
//               >
//                 {category.name}
//               </button>

//               {openCategory === category.name && (
//                 <ul className="pl-4 mt-2 text-sm space-y-1">
//                   {category.subcategories.map((sub, subIndex) => (
//                     <li key={subIndex}>
//                       <span className="font-medium">{sub.name}</span>
//                       <ul className="pl-4 text-xs">
//                         {sub.items.map((item, itemIndex) => (
//                           <li key={itemIndex}>
//                             <Link
//                               to={`/items/${item.toLowerCase().replace(/\s+/g, "-")}`}
//                               className="hover:underline"
//                             >
//                               • {item}
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Desktop Navbar */}
//       <nav className="hidden sm:flex bg-blue-500 items-center text-white p-4 space-x-6 justify-center w-full">
//   <div className="flex space-x-6">
//     {categories.map((category, index) => (
//       <div key={index} className="relative flex items-center" ref={dropdownRef}>
//         <button
//           onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
//           className="hover:bg-blue-600 p-2 rounded"
//         >
//           {category.name}
//         </button>

//         {openCategory === category.name && (
//           <div
//             className="absolute left-1/2 transform -translate-x-1/2 top-10 bg-white text-black p-4 rounded shadow-lg z-50 w-auto"
//           >
//             <h2 className="text-lg font-bold mb-4 text-center">{category.name}</h2>
//             <div className="flex gap-6">
//               {category.subcategories.map((sub, subIndex) => (
//                 <div key={subIndex} className="whitespace-nowrap">
//                   <h3 className="font-semibold border-b pb-1 text-blue-700">{sub.name}</h3>
//                   <ul className="mt-1 text-sm">
//                     {sub.items.map((item, itemIndex) => (
//                       <li key={itemIndex}>
//                         <Link
//                           to={`/items/${item.toLowerCase().replace(/\s+/g, "-")}`}
//                           className="hover:underline"
//                         >
//                           • {item}
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     ))}
//   </div>
// </nav>

//     </div>
//   );
// }
