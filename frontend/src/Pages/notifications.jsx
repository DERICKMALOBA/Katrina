import { useState, useEffect } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

export default function NotificationsPage() {
  const [notify, setNotify] = useState([]);
  
  useEffect(() => {
    socket.connect();
    const x = { Name: "matei" };
    socket.emit("checkstock", x);
    
    socket.on("stockdata", (data) => {
      setNotify(data); 
    });

    return () => {
      setNotify([]);
      socket.off("stockdata"); // Remove the event listener
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Product Stock Notifications</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {notify.map((product, index) => (
              <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {product.Name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${product.Message.toLowerCase().includes('out of stock') ? 'bg-red-100 text-red-800' : 
                      product.Message.toLowerCase().includes('low stock') ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {product.Message.includes('out of stock') ? 'Out of Stock' : 
                     product.Message.includes('low stock') ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.Message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {notify.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No stock notifications available
          </div>
        )}
      </div>
    </div>
  );
}