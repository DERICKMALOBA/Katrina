import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../Redux/AuthSlice";
import { addItem, removeFromWishlist } from "../Redux/CartSlice";
import {
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaHistory,
  FaSignOutAlt,
  FaTrash,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const viewedProducts = useSelector((state) => state.viewedProducts.products);
  const user = useSelector((state) => state.auth.user);
  const token = user?.token;
  const wishlist = useSelector((state) => state.cart.wishlist);
  const [activeSection, setActiveSection] = useState("myAccount");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const orders = [
    { id: 1, date: "2023-10-01", items: 2, total: 50.0, status: "Delivered" },
    { id: 2, date: "2023-09-25", items: 1, total: 30.0, status: "Shipped" },
  ];

  const recentActivity = [
    { id: 1, action: "Viewed Product C on 2023-10-05" },
    { id: 2, action: "Added Product D to cart on 2023-10-04" },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to delete your account.");
      return;
    }

    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(logoutUser());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");
        navigate("/");
      } else {
        console.error("Failed to delete account:", data.message || "Unknown error");
        alert(data.message || "Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Failed to delete account:", error.message);
      alert("Failed to delete account. Please try again.");
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setShowMobileMenu(false); // Close mobile menu when a section is selected
  };

  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-10">
        <p className="text-center text-red-600">Please sign in to view your profile.</p>
        <Link
          to="/sign-in"
          className="block text-center text-purple-800 hover:underline mt-4"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case "myAccount":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="overflow-x-auto">
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
          </div>
        );
      case "wishlist":
        return (
          <div className="flex flex-col gap-6">
            <div className="flex justify-center items-center">
              <h3 className="text-2xl font-semibold">Your Wishlist</h3>
            </div>
            <div className="flex-1 bg-slate-100 rounded-lg">
              {wishlist.length === 0 ? (
                <p className="text-center text-gray-500 py-6">No products in your wishlist.</p>
              ) : (
                wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between items-center border-b py-4"
                  >
                    <div className="flex items-center gap-4 ml-4">
                      <img
                        src={`http://localhost:5000${item.imageUrls[0]}`}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <button
                          onClick={() => dispatch(removeFromWishlist(item.id))}
                          className="text-red-500 flex items-center gap-1 mt-1 hover:text-red-700"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-center mr-4 mt-4 sm:mt-0">
                      <p className="text-lg font-bold">Ksh {item.discountedPrice}</p>
                      {item.discount > 0 && (
                        <div className="text-primaryBlack font-semibold text-sm mt-2">
                          <span className="line-through text-gray-500">
                            Kshs. {item.price.toFixed(2)}
                          </span>{" "}
                          Kshs. {item.discountedPrice}
                        </div>
                      )}
                      <button
                        onClick={() => dispatch(addItem(item))}
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
            <div className="flex justify-center items-center">
              <h3 className="text-2xl font-semibold">Recent Viewed</h3>
            </div>
            <div className="flex-1 bg-slate-100 rounded-lg">
              {viewedProducts.length === 0 ? (
                <p className="text-center text-gray-500 py-6">No recently viewed products.</p>
              ) : (
                viewedProducts.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between items-center border-b py-4"
                  >
                    <div className="flex items-center gap-4 ml-4">
                      <img
                        src={`http://localhost:5000${item.imageUrls[0]}`}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <button
                          onClick={() => dispatch(removeViewedProduct(item.id))}
                          className="text-red-500 flex items-center gap-1 mt-1 hover:text-red-700"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-center mr-4 mt-4 sm:mt-0">
                      <p className="text-lg font-bold">Ksh {item.discountedPrice}</p>
                      {item.discount > 0 && (
                        <div className="text-primaryBlack font-semibold text-sm mt-2">
                          <span className="line-through text-gray-500">
                            Kshs. {item.price.toFixed(2)}
                          </span>{" "}
                          Kshs. {item.discountedPrice}
                        </div>
                      )}
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
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6 mt-10">
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">User Profile</h1>
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 rounded-lg bg-gray-200 text-gray-800"
        >
          {showMobileMenu ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Profile Header (Desktop) */}
      <div className="hidden md:block text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">User Profile</h1>
        <p className="text-gray-600">Welcome back, {user.name || "User"}!</p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile Menu (Overlay) */}
        {showMobileMenu && (
          <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex">
            <div className="w-3/4 bg-white h-full p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Menu</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-lg bg-gray-200 text-gray-800"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => handleSectionChange("myAccount")}
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
                    onClick={() => handleSectionChange("orders")}
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
                    onClick={() => handleSectionChange("wishlist")}
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
                    onClick={() => handleSectionChange("recentViewed")}
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
          </div>
        )}

        {/* Left Side: Navigation Menu (Desktop) */}
        <div className="hidden md:block w-full md:w-1/4 bg-gray-50 p-6 rounded-lg shadow-sm">
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => handleSectionChange("myAccount")}
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
                onClick={() => handleSectionChange("orders")}
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
                onClick={() => handleSectionChange("wishlist")}
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
                onClick={() => handleSectionChange("recentViewed")}
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
        <div className="w-full md:w-3/4 p-4 md:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;