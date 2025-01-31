import { motion } from "framer-motion";
import { Edit, Search, Trash2, X, Plus } from "lucide-react";
import { useState } from "react";

const USER_DATA = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Samuel Green",
    email: "samuel@example.com",
    role: "User",
    status: "Active",
  },
  {
    id: 4,
    name: "Nina White",
    email: "nina@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 5,
    name: "Mark Brown",
    email: "mark@example.com",
    role: "User",
    status: "Inactive",
  },
];

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(USER_DATA);
  const [editUser, setEditUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(
      USER_DATA.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      )
    );
  };

  const handleAddUser = () => {
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
  };

  const handleEdit = (user) => {
    setEditUser({ ...user });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setFilteredUsers(
      filteredUsers.map((u) => (u.id === editUser.id ? editUser : u))
    );
    setEditUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = filteredUsers.length + 1;
    setFilteredUsers([...filteredUsers, { id: newId, ...newUser }]);
    setShowAddForm(false);
    setNewUser({
      name: "",
      email: "",
      role: "",
      status: "",
    });
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
        <div className="relative flex gap-4 items-center">
          <button
            onClick={handleAddUser}
            className="bg-primaryBlue hover:bg-blue-500 text-white font-medium rounded-lg px-10 py-2 flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            <Plus size={35} /> Add a User
          </button>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search users..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((user) => (
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
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{user.role}</td>
               
								<td className='px-6 py-4 whitespace-nowrap'>
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											user.status === "Active"
												? "bg-primaryGreen text-green-100"
												: "bg-primaryRed text-red-100"
										}`}
									>
										{user.status}
									</span>
								</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
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

      {editUser && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg w-96"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="flex justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">Edit User</h3>
              <button
                onClick={() => setEditUser(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <input
                name="name"
                placeholder="Name"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleEditChange}
                value={editUser.name}
              />
              <input
                name="email"
                placeholder="Email"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleEditChange}
                value={editUser.email}
              />
              <input
                name="role"
                placeholder="Role"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleEditChange}
                value={editUser.role}
              />
              <select
                name="status"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleEditChange}
                value={editUser.status}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-500 px-4 py-2 text-white rounded"
              >
                Save
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}

      {showAddForm && (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <motion.div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">Add User</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Name"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleInputChange}
                value={newUser.name}
              />
              <input
                name="email"
                placeholder="Email"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleInputChange}
                value={newUser.email}
              />
              <select
                name="role"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleInputChange}
                value={newUser.role}
              >
                <option value="Admin">Admin</option>
                <option value="Customer">Customer</option>
              </select>

              <select
                name="status"
                className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                onChange={handleInputChange}
                value={newUser.status}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-500 px-4 py-2 text-white rounded"
              >
                Add User
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UsersTable;
