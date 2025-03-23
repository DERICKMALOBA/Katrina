import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {logoutUser} from "../Redux/AuthSlice"
import { addItem, removeFromWishlist } from "../Redux/CartSlice"; // Import actions
import {
  FaUser,
  
  FaShoppingBag,
  FaHeart,
  FaHistory,
  FaSignOutAlt,
  FaTrash,
} from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom'; 


const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const viewedProducts = useSelector((state) => state.viewedProducts.products);
  const user = useSelector((state) => state.auth.user);
  const token = user?.token; 
  console.log('Viewed Products:', viewedProducts);
  const wishlist = useSelector((state) => state.cart.wishlist); // Get wishlist from Redux store
  const [activeSection, setActiveSection] = useState("myAccount"); // State to manage active section

  // Example data (replace with actual data from your backend or Redux store)
  const orders = [
    { id: 1, date: "2023-10-01", items: 2, total: 50.0, status: "Delivered" },
    { id: 2, date: "2023-09-25", items: 1, total: 30.0, status: "Shipped" },
  ];

  const recentActivity = [
    { id: 1, action: "Viewed Product C on 2023-10-05" },
    { id: 2, action: "Added Product D to cart on 2023-10-04" },
  ];


  const handleLogout = () => {
    dispatch(logoutUser()); // Clear user state in Redux
    localStorage.removeItem('token'); // Clear token from localStorage (if applicable)
    navigate("/"); // Redirect to the home page
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('accessToken'); 
    console.log(token)// Retrieve the token from localStorage
  
    if (!token) {
      alert('You must be logged in to delete your account.');
      return;
    }
  
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the header
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data.message); // "User deleted successfully"
        // Clear Redux state and localStorage
        dispatch(logoutUser());
        localStorage.removeItem('accessToken'); // Remove the token from localStorage
        localStorage.removeItem('userRole'); // Remove the role from localStorage
        navigate('/'); // Redirect to the home page
      } else {
        console.error('Failed to delete account:', data.message || 'Unknown error');
        alert(data.message || 'Failed to delete account. Please try again.');
      }
    } catch (error) {
      console.error('Failed to delete account:', error.message);
      alert('Failed to delete account. Please try again.');
    }
  };


  // If user is not logged in, display a message or redirect
  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-10">
        <p className="text-center text-red-600">Please sign in to view your profile.</p>
        <Link to="/sign-in" className="block text-center text-purple-800 hover:underline mt-4">
          Go to Sign In
        </Link>
      </div>
    );
  }

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "myAccount":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Details */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
              <p>
                <strong>Name:</strong> {user.name || "Not provided"}
              </p>
              <p>
                <strong>Email:</strong> {user.email || "Not provided"}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone || "Not provided"}
              </p>
              <button className="mt-4 w-full bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200">
                Edit
              </button>
            </div>

            {/* Default Address */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Default Address</h3>
              <p>
                <strong>Address:</strong> 123 Main St, Apt 4B, New York, NY 10001
              </p>
              <button className="mt-4 w-full bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200">
                Edit Address
              </button>
            </div>
          </div>
        );
      case "orders":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Order History</h2>
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
                    <td>ksh {order.total.toFixed(2)}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "wishlist":
        return (
          <div className="flex flex-col gap-6">
          {/* Centered Heading */}
          <div className="flex justify-center items-center">
            <h3 className="text-2xl font-semibold">Your Wishlist</h3>
          </div>
        
          {/* Wishlist Items */}
          <div className="flex-1 bg-slate-100 rounded-lg">
            {wishlist.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No products in your wishlist.</p>
            ) : (
              wishlist.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b py-4">
                  {/* Left Section: Image, Name, Remove Button */}
                  <div className="flex items-center gap-4 ml-4">
                    <img
                      src={`http://localhost:5000${item.imageUrls[0]}`} // Use the first image URL
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <button
                        onClick={() => dispatch(removeFromWishlist(item.id))} // Remove from wishlist
                        className="text-red-500 flex items-center gap-1 mt-1 hover:text-red-700"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
        
                  {/* Middle Section: Price, Discount, Move to Cart Button */}
                  <div className="text-center mr-4">
                    <p className="text-lg font-bold">Ksh {item.discountedPrice}</p>
                    {item.discount > 0 && (
                      <div className="text-primaryBlack font-semibold text-sm mt-2">
                        <span className="line-through text-gray-500">Kshs. {item.price.toFixed(2)}</span>{" "}
                        Kshs. {item.discountedPrice}
                      </div>
                    )}
                    {/* Move to Cart Button */}
                    <button
                      onClick={() => dispatch(addItem(item))} // Move to cart
                      className="mt-2 px-4 py-1.5 bg-purple-800 text-white rounded-md hover:bg-purple-700 transition duration-200"
                    >
                      Move to Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        );
      case "recentViewed":
        return (
          <div className="flex flex-col gap-6">
          {/* Centered Heading */}
          <div className="flex justify-center items-center">
            <h3 className="text-2xl font-semibold">Recent Viewed</h3>
          </div>
        
          {/* Viewed Products */}
          <div className="flex-1 bg-slate-100 rounded-lg">
            {viewedProducts.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No recently viewed products.</p>
            ) : (
              viewedProducts.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b py-4">
                  {/* Left Section: Image, Name */}
                  <div className="flex items-center gap-4 ml-4">
                    <img
                      src={`http://localhost:5000${item.imageUrls[0]}`} // Use the first image URL
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      {/* Optional: Add a "Remove" button if needed */}
                      <button
                        onClick={() => dispatch(removeViewedProduct(item.id))} // Remove from viewed products
                        className="text-red-500 flex items-center gap-1 mt-1 hover:text-red-700"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
        
                  {/* Middle Section: Price, Discount */}
                  <div className="text-center mr-4">
                    <p className="text-lg font-bold">Ksh {item.discountedPrice}</p>
                    {item.discount > 0 && (
                      <div className="text-primaryBlack font-semibold text-sm mt-2">
                        <span className="line-through text-gray-500">Kshs. {item.price.toFixed(2)}</span>{" "}
                        Kshs. {item.discountedPrice}
                      </div>
                    )}
                    {/* Optional: Add a "View Product" button */}
                    <Link
                      to={`/product/${item.id}`}
                      className="mt-10 mb-10 px-2 py-1 bg-purple-800 text-white rounded-md hover:bg-purple-700 transition duration-200"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-10">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">User Profile</h1>
        <p className="text-gray-600">Welcome back, {user.name || "User"}!</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Side: Navigation Menu */}
        <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg shadow-sm">
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => setActiveSection("myAccount")}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                  activeSection === "myAccount"
                    ? "bg-purple-800 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-purple-800 hover:text-white"
                } transition duration-200`}
              >
                <FaUser />
                <span>My Account</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("orders")}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                  activeSection === "orders"
                    ? "bg-purple-800 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-purple-800 hover:text-white"
                } transition duration-200`}
              >
                <FaShoppingBag />
                <span>Orders</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("wishlist")}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                  activeSection === "wishlist"
                    ? "bg-purple-800 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-purple-800 hover:text-white"
                } transition duration-200`}
              >
                <FaHeart />
                <span>Wishlist</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("recentViewed")}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                  activeSection === "recentViewed"
                    ? "bg-purple-800 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-purple-800 hover:text-white"
                } transition duration-200`}
              >
                <FaHistory />
                <span>Recent Viewed</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 p-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition duration-200"
              >
                <FaSignOutAlt />
                <span>Log Out</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleDeleteAccount}
                className="w-full flex items-center space-x-2 p-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition duration-200"
              >
                <FaTrash />
                <span>Delete Account</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Right Side: Content */}
        <div className="md:col-span-3 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;