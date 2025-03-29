import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, ShoppingBag, Eye, ArrowDownRight, ArrowUpRight } from "lucide-react";

const OverviewCards = () => {
	const [error, setError] = useState(null);
	const [revenue,setRevenue]=useState(null);
	const [revenuechange,setRevenuechange]=useState(null);
	const [users,setUsers]=useState(null);
	const [userschange,setUserschange]=useState(null);
	const [views,setViews]=useState(null);
	const [viewschange,setViewschange]=useState(null);
	const [orders,setOrders]=useState(null);
	const [orderschange,setOrderschange]=useState(null);
	const overviewData = [
		{ name: "Revenue", value: "Kshs. "+revenue, change:revenuechange, icon: DollarSign },
		{ name: "Users", value:users, change:userschange, icon: Users },
		{ name: "Orders", value:orders, change:orderschange, icon: ShoppingBag },
		{ name: "Page Views", value:views, change: viewschange, icon: Eye },
	];
	useEffect(() => {
		const fetchRevenue = async () => {
		  try {
			const response = await fetch("/api/sales/salesrevenueanalysis"); // Change this to your actual API endpoint
			if (!response.ok) {
			  throw new Error("Failed to fetch products");
			}
			const data = await response.json();
			console.log("Data is:"+data);
			setRevenue(data.Currentsales); 
			setRevenuechange(data.Deviation);
		  } catch (err) {
			setError(err.message); 
			console.log(error);
		  } 
		};
		fetchRevenue();
		}, []);
		useEffect(() => {
			const fetchUsers = async () => {
			  try {
				const response = await fetch("/api/users/analysisusers"); // Change this to your actual API endpoint
				if (!response.ok) {
				  throw new Error("Failed to fetch products");
				}
				const data = await response.json();
				console.log("Data is:"+data);
				setUsers(data.Current); 
				setUserschange(data.Change);
			  } catch (err) {
				setError(err.message); 
				console.log(error);
			  } 
			};
			fetchUsers();
			}, []);
			useEffect(() => {
				const fetchViews = async () => {
				  try {
					const response = await fetch("/api/users/analysisviews"); // Change this to your actual API endpoint
					if (!response.ok) {
					  throw new Error("Failed to fetch products");
					}
					const data = await response.json();
					console.log("Data is:"+data);
					setViews(data.Currentviews); 
					setViewschange(data.Change);
				  } catch (err) {
					setError(err.message); 
					console.log(error);
				  } 
				};
				fetchViews();
				}, []);
				useEffect(() => {
					const fetchOrders = async () => {
					  try {
						const response = await fetch("/api/orders/analysisorders"); // Change this to your actual API endpoint
						if (!response.ok) {
						  throw new Error("Failed to fetch products");
						}
						const data = await response.json();
						console.log("Data is:"+data);
						setOrders(data.Current); 
						setOrderschange(data.Change);
					  } catch (err) {
						setError(err.message); 
						console.log(error);
					  } 
					};
					fetchOrders();
					}, []);
	return (
		<div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
			{overviewData.map((item, index) => (
				<motion.div
					key={item.name}
					className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg
            rounded-xl p-6 border border-gray-700
          '
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
				>
					<div className='flex items-center justify-between'>
						<div>
							<h3 className='text-sm font-medium text-gray-400'>{item.name}</h3>
							<p className='mt-1 text-xl font-semibold text-gray-100'>{item.value}</p>
						</div>

						<div
							className={`
              p-3 rounded-full bg-opacity-20 ${item.change >= 0 ? "bg-green-500" : "bg-red-500"}
              `}
						>
							<item.icon className={`size-6  ${item.change >= 0 ? "text-green-500" : "text-red-500"}`} />
						</div>
					</div>
					<div
						className={`
              mt-4 flex items-center ${item.change >= 0 ? "text-green-500" : "text-red-500"}
            `}
					>
						{item.change >= 0 ? <ArrowUpRight size='20' /> : <ArrowDownRight size='20' />}
						<span className='ml-1 text-sm font-medium'>{Math.abs(item.change)}%</span>
						<span className='ml-2 text-sm text-gray-400'>vs Last year</span>
					</div>
				</motion.div>
			))}
		</div>
	);
};
export default OverviewCards;
