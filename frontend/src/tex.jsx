 const fetchFilteredProducts = async () => {
    try {
        let apiUrl = "/api/products/productslist";
        const queryParams = new URLSearchParams();

        if (discount) {
            apiUrl = "/api/products/discount";
            queryParams.append("discount", discount);
        } else if (size) {
            apiUrl = "/api/products/size";
            queryParams.append("size", size);
        } else if (rating) {
            apiUrl = "/api/products/rating";
        } else if (priceRange.min || priceRange.max) {
            apiUrl = "/api/products/price"; // Use price filtering route
            if (priceRange.min) queryParams.append("minPrice", priceRange.min);
            if (priceRange.max) queryParams.append("maxPrice", priceRange.max);
        } else if (sortBy) {
            apiUrl = "/api/products/pricedescasce";
            queryParams.append("sortBy", sortBy);
        }

        const fullUrl = `${apiUrl}?${queryParams.toString()}`;
        console.log("Fetching:", fullUrl);
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

// Fetch products when triggerSearch changes
useEffect(() => {
    if (triggerSearch) {
        fetchFilteredProducts();
        setTriggerSearch(false); // Reset trigger
    }
}, [triggerSearch]);






















<div className="mx-auto p-6 bg-gray-100 rounded-lg shadow-md space-y-6 relative">
<div className="flex">
  <div className="w-3/4 pr-6 space-y-6">
    {/* Customer Details */}
    <div
      className={`p-4 border rounded-lg ${
        customerDetailsCleared ? "bg-green-100" : "bg-white"
      }`}
    >
      <h1 className="text-xl font-semibold text-gray-800">
        Customer Details
      </h1>
      {!customerDetailsCleared ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              className="p-2 border rounded w-full"
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              className="p-2 border rounded w-full"
              type="text"
              placeholder="Second Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              className="p-2 border rounded w-full"
              type="text"
              placeholder="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
            <input
              className="p-2 border rounded w-full"
              type="text"
              placeholder="Alternative Phone Number"
              name="altPhoneNumber"
              value={formData.altPhoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <input
            className="p-2 border rounded w-full"
            type="text"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            {/* County Dropdown */}
            <select
              className="p-2 border rounded w-full"
              value={selectedCounty}
              onChange={handleCountyChange}
              required
            >
              <option value="">Select a County</option>
              {deliveryData.counties.map((county, index) => (
                <option key={index} value={county}>
                  {county}
                </option>
              ))}
            </select>

            {/* City Dropdown (Disabled until a county is selected) */}
            <select
              className="p-2 border rounded w-full"
              value={selectedCity}
              onChange={handleCityChange}
              disabled={!selectedCounty}
              required
            >
              <option value="">Select a City</option>
              {selectedCounty &&
                deliveryData.cities[selectedCounty]?.map(
                  (city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  )
                )}
            </select>
          </div>

          {/* Display Delivery Fee */}
          <div className="mt-4">
            <label className="text-gray-700 font-semibold">
              Delivery Fee:
            </label>
            <input
              className="p-2 border rounded w-full bg-gray-100"
              type="text"
              value={formData.deliveryFee || ""}
              readOnly
            />
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
              Cancel
            </button>
            <button
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
              onClick={() => setCustomerDetailsCleared(true)}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-green-600 flex items-center">
            ✔ <span className="ml-2">Customer Details</span>
          </h3>
          <button
            className="text-primaryBlack hover:underline"
            onClick={() => setCustomerDetailsCleared(false)}
          >
            Change
          </button>
        </div>
      )}
    </div>

    {/* Delivery Details */}
    {customerDetailsCleared && (
      <div
        className={`p-4 border rounded-lg ${
          deliveryDetailsCleared ? "bg-green-100" : "bg-white"
        }`}
      >
        <h1 className="text-xl font-semibold text-gray-800">
          Delivery Details
        </h1>
        {!deliveryDetailsCleared ? (
          <div className="space-y-4">
            <select
              className="p-2 border rounded w-full"
              value={formData.deliveryVehicle}
              onChange={handleInputChange}
              name="deliveryVehicle"
              required
            >
              <option value="">Select Delivery Vehicle</option>
              {deliveryData.deliveryVehicles &&
              deliveryData.deliveryVehicles.length > 0 ? (
                deliveryData.deliveryVehicles.map((vehicle, index) => (
                  <option key={index} value={vehicle}>
                    {vehicle}
                  </option>
                ))
              ) : (
                <option value="">No vehicles available</option>
              )}
            </select>
            <input
              className="p-2 border rounded w-full"
              type="text"
              placeholder="Delivery Fee"
              name="deliveryFee"
              value={formData.deliveryFee}
              onChange={handleInputChange}
              required
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
                Cancel
              </button>
              <button
                className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                onClick={() => setDeliveryDetailsCleared(true)}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-green-600 flex items-center">
              ✔ <span className="ml-2">Delivery Details</span>
            </h3>
            <button
              className="text-primaryBlack hover:underline"
              onClick={() => setDeliveryDetailsCleared(false)}
            >
              Change
            </button>
          </div>
        )}
      </div>
    )}

    {/* Payment Details */}
    {deliveryDetailsCleared && (
      <div
        className={`p-4 border rounded-lg ${
          paymentCleared ? "bg-green-100" : "bg-white"
        }`}
      >
        <h1 className="text-xl font-semibold text-gray-800">
          Payment Details
        </h1>
        {!paymentCleared ? (
          <div className="space-y-4">
            <select
              className="p-2 border rounded w-full"
              value={formData.paymentMethod}
              onChange={handlePaymentMethodChange}
              required
            >
              <option value="">Select Payment Method</option>
              <option value="credit_card">Credit Card</option>
              <option value="mpesa">Mpesa</option>
            </select>
            {formData.paymentMethod === "credit_card" && (
              <CreditCardPayment />
            )}
            {formData.paymentMethod === "mpesa" && <MpesaPayment />}
            <div className="flex justify-end space-x-4 mt-4">
              <button className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
                Cancel
              </button>
              <button
                className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                onClick={() => setPaymentCleared(true)}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-green-600 flex items-center">
              ✔ <span className="ml-2">Payment Details</span>
            </h3>
            <button
              className="text-primaryBlack hover:underline"
              onClick={() => setPaymentCleared(false)}
            >
              Change
            </button>
          </div>
        )}
      </div>
    )}
  </div>

  <div className="w-1/4">
    {/* Order Summary */}
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h3 className="text-xl font-semibold">Order Summary</h3>
      <div className="space-y-2 mt-4">
        <p>Total Price: KSh {totalPrice}</p>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
          onClick={handleSubmit}
        >
          Complete Order
        </button>
      </div>
    </div>
  </div>
</div>
</div>
















import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const categories = [
  {
    name: "Outfits",
    subcategories: [
      { name: "Boys Outfits", items: ["Trouser sets", "Short sets", "Trousers", "T-Shirts"] },
      { name: "Girls Outfits", items: ["Trouser set", "Short set", "Skirt set", "Dresses", "Fancy wear", "Trousers", "Tops", "Leggings"] },
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
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutsideDropdown(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenCategory(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => document.removeEventListener("mousedown", handleClickOutsideDropdown);
  }, []);

  return (
    <div className="relative">
      <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
        <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        ref={menuRef}
        className={`fixed inset-y-0 left-0 w-64 bg-blue-600 text-white p-4 transition-transform transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } sm:hidden z-50`}
      >
        <ul className="mt-10 space-y-4">
          {categories.map((category, index) => (
            <li key={index}>
              <button
                onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
                className="w-full text-left font-semibold hover:bg-blue-700 p-2 rounded"
              >
                {category.name}
              </button>
              {openCategory === category.name && (
                <ul className="pl-4 mt-2 text-sm space-y-1">
                  {category.subcategories.map((sub, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        to={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}/${sub.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="font-medium hover:underline"
                      >
                        {sub.name}
                      </Link>
                      <ul className="pl-4 text-xs">
                        {sub.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <Link
                              to={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}/${sub.name.toLowerCase().replace(/\s+/g, "-")}/${item.toLowerCase().replace(/\s+/g, "-")}`}
                              className="hover:underline"
                            >
                              • {item}
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
  );
}

















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
          <Link to="/products/tops" className="text-gray-700 font-medium text-sm sm:text-base">
            Tops
          </Link>
          <Link to="/products/bottoms" className="text-gray-700 font-semibold text-sm sm:text-base">
            Bottoms
          </Link>
          <Link to="/products/dressers" className="text-gray-700 font-medium text-sm sm:text-base">
            Dressers
          </Link>
          <Link to="/products/outer" className="text-gray-700 font-medium text-sm sm:text-base">
            Outer Wear
          </Link>
          <Link to="/products/sleep" className="text-gray-700 font-medium text-sm sm:text-base">
            Sleep Wear
          </Link>
          <Link to="/products/under" className="text-gray-700 font-medium text-sm sm:text-base">
            Under Wear
          </Link>
          <Link to="/products/foot" className="text-gray-700 font-medium text-sm sm:text-base">
            Foot Wear
          </Link>
          <Link to="/products/accessories" className="text-gray-700 font-medium text-sm sm:text-base">
            Accessories
          </Link>
          <Link to="/products/special" className="text-gray-700 font-medium text-sm sm:text-base">
            Special Occasions
          </Link>
          <Link to="/products/sports" className="text-gray-700 font-medium text-sm sm:text-base">
            SportsWear
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Nav;













import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const categories = [
  {
    name: "Outfits",
    subcategories: [
      { name: "Boys Outfits", items: ["Trouser sets", "Short sets", "Trousers", "T-Shirts"] },
      { name: "Girls Outfits", items: ["Trouser set", "Short set", "Skirt set", "Dresses", "Fancy wear", "Trousers", "Tops", "Leggings"] },
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
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutsideDropdown(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenCategory(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => document.removeEventListener("mousedown", handleClickOutsideDropdown);
  }, []);

  return (
    <div className="relative">
      <div className="flex justify-between items-center p-4 bg-white text-purple-800">
        <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div ref={menuRef} className={`fixed inset-y-0 left-0 w-64 bg-purple-800 text-white p-4 transition-transform transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} sm:hidden z-50`}>
        <div className="mt-10 space-y-4 overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-600">
          <ul>
            {categories.map((category, index) => (
              <li key={index} className="items">
                <button onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)} className="w-full text-left font-semibold hover:bg-gray-700 p-2 rounded transition duration-300">
                  {category.name}
                </button>
                {openCategory === category.name && (
                  <ul className="pl-4 mt-2 text-sm space-y-1">
                    {category.subcategories.map((sub, subIndex) => (
                      <li key={subIndex}>
                        <Link to={`/subcategories/${sub.name.toLowerCase().replace(/\s+/g, "-")}`} className="text-base border-b pb-1 text-white hover:underline">
                          {sub.name}
                        </Link>
                        <ul className="pl-4 text-xs">
                          {sub.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link to={`/items/${item.toLowerCase().replace(/\s+/g, "-")}`} className="hover:underline text-lg gap-4 text-primaryOrange">
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

      <nav className="hidden sm:flex text-2xl bg-whitesmoke items-center text-purple-800 p-4 space-x-6 justify-center w-full">
        <div className="flex space-x-6">
          {categories.map((category, index) => (
            <div key={index} className="relative flex items-center" ref={dropdownRef}>
              <button onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)} className="hover:bg-gray-800 p-2 rounded">
                {category.name}
              </button>
              {openCategory === category.name && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-10 bg-white text-black p-4 rounded shadow-lg z-50 w-auto">
                  <div className="flex gap-6 rounded-lg">
                    {category.subcategories.map((sub, subIndex) => (
                      <div key={subIndex} className="whitespace-nowrap">
                        <Link to={`/subcategories/${sub.name.toLowerCase().replace(/\s+/g, "-")}`} className="hover:underline text-lg">
                          <h3 className="text-base border-b pb-1 text-purple-800">{sub.name}</h3>
                        </Link>
                        <ul className="mt-1 text-sm">
                          {sub.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link to={`/items/${item.toLowerCase().replace(/\s+/g, "-")}`} className="hover:underline text-lg gap-4 text-primaryOrange">
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





import { useState, useEffect } from "react";
import MpesaPayment from "./Mpesa";
import { useSelector } from "react-redux";

const CheckoutPage = () => {
  const totalPrice = useSelector((state) => state.cart.totalPrice);

  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [customerDetailsCleared, setCustomerDetailsCleared] = useState(false);
  const [deliveryDetailsCleared, setDeliveryDetailsCleared] = useState(false);
  const [paymentCleared, setPaymentCleared] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    altPhoneNumber: "",
    address: "",
    county: "",
    city: "",
    deliveryVehicle: "",
    deliveryFee: "",
    paymentMethod: "",
    mpesaNumber: "",
  });

  // ... (other functions remain unchanged)

  return (
    <div className="mx-auto p-6 bg-gray-100 rounded-lg shadow-md space-y-6">
      {/* Flex container for responsive layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Customer Details, Delivery Details, Payment Details */}
        <div className="w-full md:w-3/4 space-y-6">
          {/* Customer Details */}
          <div className={`p-4 border rounded-lg ${customerDetailsCleared ? "bg-green-100" : "bg-white"}`}>
            <h1 className="text-xl font-semibold text-gray-800">Customer Details</h1>
            {/* ... (Customer Details content) */}
          </div>

          {/* Delivery Details */}
          {customerDetailsCleared && (
            <div className={`p-4 border rounded-lg ${deliveryDetailsCleared ? "bg-green-100" : "bg-white"}`}>
              <h1 className="text-xl font-semibold text-gray-800">Delivery Details</h1>
              {/* ... (Delivery Details content) */}
            </div>
          )}

          {/* Payment Details */}
          {deliveryDetailsCleared && (
            <div className={`p-4 border rounded-lg ${paymentCleared ? "bg-green-100" : "bg-white"}`}>
              <h1 className="text-xl font-semibold text-gray-800">Payment Details</h1>
              {/* ... (Payment Details content) */}
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full md:w-1/4">
          <div className="p-4 border rounded-lg bg-white shadow-md">
            <h3 className="text-xl font-semibold">Order Summary</h3>
            <div className="bg-white shadow-md rounded-lg p-4 mt-4">
              <div className="space-y-4">
                {/* Item Total */}
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Item Total:</span>
                  <span className="text-gray-900">Ksh {parseFloat(totalPrice) || 0}</span>
                </div>

                {/* Delivery Fee */}
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Delivery Fee:</span>
                  <span className="text-gray-900">Ksh {parseFloat(formData?.deliveryFee) || 0}</span>
                </div>

                {/* Total Cost */}
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <div className="mt-4 font-bold text-lg">
                    <span>Total Cost:</span>
                    <span>
                      Ksh{" "}
                      {parseFloat(totalPrice) + (parseFloat(formData?.deliveryFee) || 0)}
                    </span>
                  </div>
                </div>

                {/* Complete Order Button */}
                <button
                  className="bg-purple-800 text-white p-3 rounded-lg hover:bg-purple-700 w-full transition duration-200"
                  onClick={handleSubmit}
                >
                  Complete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;













import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa"; // Import the send icon
import { IoClose } from "react-icons/io5"; // Import the close icon

export default function ChatComponent({ user }) {
  const [messages, setMessages] = useState([
    { id: 1, msg: "Hello!", email: "user1@example.com" },
    { id: 2, msg: "Hi there!", email: "user2@example.com" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, msg: newMessage, email: user.email },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="fixed bottom-10 right-10 w-80 bg-white shadow-2xl rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="flex justify-between items-center bg-blue-500 text-white p-4">
        <h2 className="text-lg font-bold">Messages</h2>
        <button
          onClick={() => console.log("Close chat")} // Add close functionality
          className="hover:bg-blue-600 p-1 rounded-full"
        >
          <IoClose className="text-xl" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="h-60 overflow-y-auto p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100">
        {messages.map((msg) => {
          const isSender = msg.email === user.email;

          return (
            <div
              key={msg.id}
              className={`flex ${isSender ? "justify-end" : "justify-start"} mb-3`}
            >
              <div
                className={`p-3 rounded-lg max-w-[70%] ${
                  isSender
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.msg}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="flex items-center p-4 border-t">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
        >
          <FaPaperPlane className="text-lg" />
        </button>
      </form>
    </div>
  );
}












import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import { useState } from 'react';

function Footer() {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed with email: ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="bg-gray-700 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* First Row: Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand and Help Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Katrina Kid's Closet</h2>
            <h3 className="font-semibold">Need Help?</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="/chats" className="hover:text-green-400">Chat with Us</a></li>
              <li><a href="/contact" className="hover:text-green-400">Contact Us</a></li>
              <li><a href="/help-center" className="hover:text-green-400">Help Center</a></li>
            </ul>
          </div>

          {/* Email Subscription Section */}
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold mb-2">Subscribe to Our Newsletter</h2>
            <p className="text-sm mb-4">Stay updated with the latest news, offers, and discounts</p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col md:flex-row items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-black p-2 rounded-lg w-full md:w-64"
                required
              />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Subscribe
              </button>
            </form>
          </div>

          {/* Useful Links Section */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-green-400">About Us</a></li>
              <li><a href="/faq" className="hover:text-green-400">FAQ</a></li>
              <li><a href="/terms" className="hover:text-green-400">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-green-400">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Second Row: Social Media Section */}
        <div className="mt-8 text-center">
          <h3 className="font-bold text-lg mb-2">Follow Us</h3>
          <div className="flex justify-center gap-6 text-2xl">
            <a href="#" className="hover:text-blue-400"><FaFacebook size={40} /></a>
            <a href="#" className="hover:text-red-400"><FaInstagram size={40} /></a>
            <a href="#" className="hover:text-green-400"><FaWhatsapp size={40} /></a>
            <a href="#" className="hover:text-gray-400"><FaTiktok size={40} /></a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center text-sm mt-8">
          <p>&copy; {new Date().getFullYear()} Katrina Kid's Closet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


































import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Profile({ onClose }) {
  const user = useSelector((state) => state.auth.user); // Get user from auth slice

  // Example data (replace with actual data from your backend or Redux store)
  const orders = [
    { id: 1, date: '2023-10-01', items: 2, total: 50.0, status: 'Delivered' },
    { id: 2, date: '2023-09-25', items: 1, total: 30.0, status: 'Shipped' },
  ];

  const addresses = [
    { id: 1, name: 'Home', address: '123 Main St, Apt 4B, New York, NY 10001' },
    { id: 2, name: 'Work', address: '456 Broadway, Suite 200, New York, NY 10002' },
  ];

  const paymentMethods = [
    { id: 1, type: 'Visa', last4: '1234', expires: '12/2025' },
    { id: 2, type: 'MasterCard', last4: '5678', expires: '06/2024' },
  ];

  const wishlistItems = [
    { id: 1, name: 'Product A', price: 20.0, image: 'product-a.jpg' },
    { id: 2, name: 'Product B', price: 35.0, image: 'product-b.jpg' },
  ];

  const recentActivity = [
    { id: 1, action: 'Viewed Product C on 2023-10-05' },
    { id: 2, action: 'Added Product D to cart on 2023-10-04' },
  ];

  // If user is not logged in, display a message or redirect
  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="absolute right-0 mt-2 w-[800px] bg-white rounded-lg shadow-lg p-6">
        <p className="text-center text-red-600">Please sign in to view your profile.</p>
        <Link to="/signin" className="block text-center text-purple-800 hover:underline mt-4">
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-[800px] bg-white rounded-lg shadow-lg p-6">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 bg-purple-800 text-white py-1 px-3 rounded-lg hover:bg-purple-700 transition duration-200"
      >
        X
      </button>

      {/* Grid Layout for Sections */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
            <p><strong>Name:</strong> {user.name || 'Not provided'}</p>
            <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
            <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
            <button className="mt-2 w-full bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200">
              Edit
            </button>
          </div>

          {/* Address Book */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Saved Addresses</h2>
            {addresses.map((address) => (
              <div key={address.id} className="mb-4 p-4 border rounded-lg">
                <p><strong>{address.name}</strong></p>
                <p>{address.address}</p>
                <button className="mt-2 w-full bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200">
                  Edit
                </button>
                <button className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition duration-200">
                  Delete
                </button>
              </div>
            ))}
            <button className="w-full bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200">
              Add New Address
            </button>
          </div>

          {/* Payment Methods */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Payment Methods</h2>
            {paymentMethods.map((payment) => (
              <div key={payment.id} className="mb-4 p-4 border rounded-lg">
                <p><strong>{payment.type} ending in {payment.last4}</strong></p>
                <p>Expires {payment.expires}</p>
                <button className="mt-2 w-full bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200">
                  Edit
                </button>
                <button className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition duration-200">
                  Delete
                </button>
              </div>
            ))}
            <button className="w-full bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200">
              Add New Payment Method
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Order History */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Order History</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.items} Items</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Wishlist */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Wishlist</h2>
            {wishlistItems.map((item) => (
              <div key={item.id} className="mb-4 p-4 border rounded-lg flex items-center">
                <img src={item.image} alt={item.name} className="w-16 h-16 mr-4" />
                <div>
                  <p>{item.name}</p>
                  <p>${item.price.toFixed(2)}</p>
                  <button className="mt-2 w-full bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200">
                    Move to Cart
                  </button>
                  <button className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition duration-200">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
            {recentActivity.map((activity) => (
              <div key={activity.id} className="mb-2">
                <p>{activity.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row (Full Width) */}
      <div className="mt-6">
        {/* Account Settings */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
          <button className="w-full bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200">
            Change Password
          </button>
          <button className="mt-2 w-full bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200">
            Notification Preferences
          </button>
          <button className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition duration-200">
            Delete Account
          </button>
        </div>

        {/* Loyalty Points */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Loyalty Points</h2>
          <p>You have <strong>500 points</strong>.</p>
          <p>Redeem your points for discounts on your next purchase!</p>
        </div>

        {/* Support and Help */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Support</h2>
          <ul>
            <li><Link to="/contact" className="text-purple-800 hover:underline">Contact Us</Link></li>
            <li><Link to="/faq" className="text-purple-800 hover:underline">FAQs</Link></li>
            <li><Link to="/returns" className="text-purple-800 hover:underline">Return Policy</Link></li>
          </ul>
        </div>

        {/* Logout Button */}
        <div>
          <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition duration-200">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;