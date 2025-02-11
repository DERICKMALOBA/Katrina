import { motion } from "framer-motion";
import { Trash2} from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
const UsersTable = () => {
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]); 
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users/userslist"); // Change this to your actual API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setUsers(data); // Set products to state
    } catch (err) {
      setError(err.message); // Handle errors
      console.log(error);
    } 
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleDelete =async(ui) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }
    const res = await fetch('/api/users/deleteusers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({userid:ui})
    });
    const data = await res.json();
       if(res.ok) {
        fetchUsers();
       }
    if (!data.success) {
      console.log(data.message);
    }
    
};
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">User List</h2>
         </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-sm text-gray-300">
				<div className='flex items-center'>
										<div className='flex-shrink-0 h-10 w-10'>
											<div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
												{user.name.charAt(0)}
											</div>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium text-gray-100'>{user.name}</div>
										</div>
									</div>
				</td>
        <td className="px-6 py-4 text-sm text-gray-300">
                  {"0"+user.phone}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleDelete(user.userid)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UsersTable;
