// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Profile({ onClose }) {
//   const user = useSelector((state) => state.auth.user); // Get user from auth slice

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
  if (!user) {
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