import  { useState } from 'react';
import { useSelector } from 'react-redux';
import { PencilIcon } from '@heroicons/react/24/outline';  // Heroicons v2 import


const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);// Assuming you have user data in redux
  const { name, email, phone } = user;
  const { address, county, city, deliveryVehicle } = user;

  // State for edit modes
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedUserDetails, setEditedUserDetails] = useState({
    name,
    email,
    phone
  });
  const [editedAddressDetails, setEditedAddressDetails] = useState({
    address,
    county,
    city,
    deliveryVehicle
  });

  // Handlers for updating fields
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setEditedUserDetails({ ...editedUserDetails, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditedAddressDetails({ ...editedAddressDetails, [name]: value });
  };

  const handleCountyChange = (e) => {
    setEditedAddressDetails({ ...editedAddressDetails, county: e.target.value });
  };

  const handleCityChange = (e) => {
    setEditedAddressDetails({ ...editedAddressDetails, city: e.target.value });
  };

  // Sample data for counties and cities
  const deliveryData = {
    counties: ['Nairobi', 'Mombasa', 'Kisumu'],
    cities: {
      Nairobi: ['Nairobi City', 'Kajiado'],
      Mombasa: ['Mombasa City', 'Kilifi'],
      Kisumu: ['Kisumu City', 'Siaya']
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
  
    if (token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  
    localStorage.removeItem("token"); // Remove token
    window.location.href = "/login"; // Redirect to login
  };
  

  return (
    <div className="flex flex-wrap gap-4 p-6">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/4 bg-gray-100 p-4 rounded-lg shadow-md">
        <ul>
          <li className="py-2"><button className="w-full text-left text-lg">Orders</button></li>
          <li className="py-2"><button className="w-full text-left text-lg">Whitelist</button></li>
          <li className="py-2"><button className="w-full text-left text-lg">Close Account</button></li>
          <li className="py-2"><button onClick={handleLogout} className="w-full text-left text-lg">Logout</button></li>
        </ul>
      </div>

      {/* User Details (Center) */}
      <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">User Profile</h2>

        {isEditingUser ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="name"
              value={editedUserDetails.name}
              onChange={handleUserChange}
              className="p-2 rounded-md border border-gray-300 placeholder-gray-500"
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              value={editedUserDetails.email}
              onChange={handleUserChange}
              className="p-2 rounded-md border border-gray-300 placeholder-gray-500"
              placeholder="Email"
            />
            <input
              type="tel"
              name="phone"
              value={editedUserDetails.phone}
              onChange={handleUserChange}
              className="p-2 rounded-md border border-gray-300 placeholder-gray-500"
              placeholder="Phone Number"
            />
            <button
              className="mt-4 bg-blue-500 text-white p-2 rounded-md"
              onClick={() => setIsEditingUser(false)}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div>
            <p className="text-lg font-medium">Name: {user.name}</p>
            <p className="text-lg font-medium">Email: {user.email}</p>
            <p className="text-lg font-medium">Phone: {user.phone}</p>
            <button
              className="mt-4 text-blue-500 flex items-center justify-center"
              onClick={() => setIsEditingUser(true)}
            >
              <PencilIcon className="h-5 w-5 mr-1" /> Edit Details
            </button>
          </div>
        )}
      </div>

      {/* Address Details (Right) */}
      <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Address Details</h3>

        {isEditingAddress ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                className="p-2 border rounded w-full"
                type="text"
                placeholder="Address"
                name="address"
                value={editedAddressDetails.address}
                onChange={handleAddressChange}
                required
              />
              <input
                className="p-2 border rounded w-full"
                type="text"
                placeholder="Delivery Vehicle"
                name="deliveryVehicle"
                value={editedAddressDetails.deliveryVehicle}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* County Dropdown */}
              <select
                className="p-2 border rounded w-full"
                value={editedAddressDetails.county}
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
                value={editedAddressDetails.city}
                onChange={handleCityChange}
                disabled={!editedAddressDetails.county}
                required
              >
                <option value="">Select a City</option>
                {editedAddressDetails.county &&
                  deliveryData.cities[editedAddressDetails.county]?.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            </div>

            {/* Display Delivery Fee */}
            <div className="mt-4">
              <label className="text-gray-700 font-semibold">Delivery Fee:</label>
              <input
                className="p-2 border rounded w-full bg-gray-100"
                type="text"
                value={editedAddressDetails.deliveryFee || ""}
                readOnly
              />
            </div>

            <div className="flex justify-end space-x-4 mt-4">
              <button className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
                Cancel
              </button>
              <button
                className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                onClick={() => setIsEditingAddress(false)}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>County:</strong> {county}</p>
            <p><strong>City:</strong> {city}</p>
            <p><strong>Delivery Vehicle:</strong> {deliveryVehicle}</p>
            <button
              className="mt-4 text-blue-500 flex items-center justify-center"
              onClick={() => setIsEditingAddress(true)}
            >
              <PencilIcon className="h-5 w-5 mr-1" /> Edit Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
