import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState,useEffect} from "react";
const DailyOrders = () => {
	const [error, setError] = useState(null);
	const [mon, setMon] = useState(null);
	const [tue, setTue] = useState(null);
	const [wed, setWed] = useState(null);
	const [thur, setThur] = useState(null);
	const [fri, setFri] = useState(null);
	const [sat, setSat] = useState(null);
	const [sun, setSun] = useState(null);
	const dailyOrdersData = [
		{ date: "Sun", orders: sun },
		{ date: "Mon", orders: mon },
		{ date: "Tue", orders: tue},
		{ date: "Wed", orders: wed },
		{ date: "Thur", orders: thur },
		{ date: "Fri", orders: fri },
		{ date: "Sat", orders: sat },
	];
	useEffect(() => {
		const fetchUsers = async () => {
		  try {
			const response = await fetch("/api/orders/weekorders"); // Change this to your actual API endpoint
			if (!response.ok) {
			  throw new Error("Failed to fetch products");
			}
			const data = await response.json();
			console.log("Data is:"+data);
			setMon(data.Mon); 
			setTue(data.Tue);
			setWed(data.Wed); 
			setThur(data.Thur);
			setFri(data.Fri); 
			setSat(data.Sat);
			setSun(data.Sun);
		  } catch (err) {
			setError(err.message); // Handle errors
			console.log(error);
		  } 
		};
		fetchUsers();
		
		}, []);
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>Daily Orders</h2>

			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<LineChart data={dailyOrdersData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='date' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Line type='monotone' dataKey='orders' stroke='#8B5CF6' strokeWidth={2} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default DailyOrders;
