import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Edit } from "lucide-react";

const OrdersTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [error, setError] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");

        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/orders/orderslist");
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data = await response.json();
                setFilteredOrders(data);
            } catch (err) {
                setError(err.message);
				console.log(error);
            }
        };
		useEffect(() => {
        fetchOrders();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = filteredOrders.filter(
            (order) => order.id.toLowerCase().includes(term) || order.customer.toLowerCase().includes(term)
        );
        setFilteredOrders(filtered);
    };

    const openEditModal = (orderid) => {
        setEditingOrder(orderid);
    };
	const Status=(e) => {
        setSelectedStatus(e.target.value);
    };
    const closeEditModal = () => {
        setEditingOrder(null);
    };

	const handleSubmit = async () => {
			if(selectedStatus!="Shipped"&&selectedStatus!="Delivered")
			{	
			alert("Please select a valid status.");
			setEditingOrder(null);
			return;
			}
		try {
			const res = await fetch('/api/orders/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ Value: selectedStatus, Id: editingOrder }),
			});
	
			if (!res.ok) {
				throw new Error("Failed to update order status.");
			}
			if(res.ok)
			{
				closeEditModal();
				fetchOrders();
				setEditingOrder(null);
				setSelectedStatus(null);
			}
	
			const data = await res.json();
	
			if (!data.success) {
				setError(data.message || "An unknown error occurred.");
				return;
			}

	
		} catch (err) {
			setError(err.message);
			console.error("Error updating order:", err);
		}
	};	
    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Order List</h2>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='Search orders...'
                        className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                </div>
            </div>

            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Order ID</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Customer</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Phone</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Email</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Amount</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Status</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-gray-700'>
                        {filteredOrders.map((order) => (
                            <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>ORD{order.orderid}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{order.name}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>0{order.phone}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{order.email}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>ksh.{order.amount}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											order.status === "Delivered"
												? "bg-green-100 text-green-800"
												: order.status === "Processing"
												? "bg-yellow-100 text-yellow-800"
												: order.status === "Shipped"
												? "bg-blue-100 text-blue-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{order.status}
									</span>
								</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                    <button onClick={() => openEditModal(order.orderid,order.status)}>
                                        <Edit size={18} className='text-gray-400 hover:text-gray-200' />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingOrder && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
                    <div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
                        <h3 className='text-lg font-semibold text-gray-100 mb-4'>Edit Order Status</h3>
                        <select className='w-full p-2 bg-gray-700 text-white rounded-lg' onChange={Status}>
						<option value='NULL'>  </option>
                            <option value='Delivered'>Delivered</option>
                            <option value='Shipped'>Shipped</option>
                        </select>
                        <div className='flex justify-end mt-4'>
                            <button onClick={closeEditModal} className='mr-2 px-4 py-2 bg-gray-600 text-white rounded-lg'>Cancel</button>
                            <button onClick={handleSubmit} className='px-4 py-2 bg-blue-600 text-white rounded-lg'>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default OrdersTable;
