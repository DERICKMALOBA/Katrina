import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useState,useEffect} from "react";
import StatCard from "../SharedComponent/StatCard";
import DailyOrders from "../orders/DailyOrders";
import OrderDistribution from "../orders/OrderDistribution";
import OrdersTable from "../orders/OrdersTable";
const OrdersPage = () => {
	const [error, setError] = useState(null);
	const [totalorder, setTotalorder] = useState(null);
	const orderStats = {
		totalOrders: totalorder,
		pendingOrders: "56",
		completedOrders: "1,178",
		totalRevenue: "98,765",
	};
useEffect(() => {
	const fetchNew = async () => {
		try {
		  const response = await fetch("/api/orders/totalorders"); // Change this to your actual API endpoint
		  if (!response.ok) {
			throw new Error("Failed to fetch products");
		  }
		  const dat = await response.json();
		  console.log("Data is:"+dat);
		  setTotalorder(dat.Totalorders); // Set products to state
		} catch (err) {
		  setError(err.message); // Handle errors
		  console.log(error);
		} 
	  };
	  	  
	fetchNew(); 
	  }, []);
	return (
		<div className='flex-1 relative z-10 overflow-auto'>
			

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Orders' icon={ShoppingBag} value={orderStats.totalOrders} color='#6366F1' />
					<StatCard name='Pending Orders' icon={Clock} value={orderStats.pendingOrders} color='#F59E0B' />
					<StatCard
						name='Completed Orders'
						icon={CheckCircle}
						value={orderStats.completedOrders}
						color='#10B981'
					/>
					<StatCard name='Total Revenue' icon={DollarSign} value={orderStats.totalRevenue} color='#EF4444' />
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<DailyOrders />
					<OrderDistribution />
				</div>

				<OrdersTable />
			</main>
		</div>
	);
};
export default OrdersPage;
