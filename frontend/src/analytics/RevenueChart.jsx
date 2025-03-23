import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
const RevenueChart = () => {
	const [error, setError] = useState(null);
		const [jan, setJan] = useState(null);
		const [feb, setFeb] = useState(null);
		const [mar, setMar] = useState(null);
		const [apr, setApr] = useState(null);
		const [may, setMay] = useState(null);
		const [jun, setJun] = useState(null);
		const [jul, setJul] = useState(null);
		const [aug, setAug] = useState(null);
		const [sep, setSep] = useState(null);
		const [oct, setOct] = useState(null);
		const [nov, setNov] = useState(null);
		const [dec, setDec] = useState(null);
		const revenueData  = [
			{ month: "Jan", revenue: jan },
			{ month: "Feb", revenue: feb },
			{ month: "Mar", revenue: mar },
			{ month: "Apr", revenue: apr },
			{ month: "May", revenue: may },
			{ month: "Jun", revenue: jun },
			{ month: "Jul", revenue: jul },
			{ month: "Aug", revenue: aug },
			{ month: "Sep", revenue: sep },
			{ month: "Oct", revenue: oct },
			{ month: "Nov", revenue: nov },
			{ month: "Dec", revenue: dec },
		];
		useEffect(() => {
			const fetchSales = async () => {
			  try {
				const response = await fetch("/api/sales/salesgrowth"); // Change this to your actual API endpoint
				if (!response.ok) {
				  throw new Error("Failed to fetch products");
				}
				const data = await response.json();
				console.log("Data is:"+data);
				setJan(data.Jan); 
				setFeb(data.Feb);
				setMar(data.Mar); 
				setApr(data.Apr);
				setMay(data.May); 
				setJun(data.Jun);
				setJul(data.Jul); 
				setAug(data.Aug);
				setSep(data.Sep); 
				setOct(data.Oct);
				setNov(data.Nov); 
				setDec(data.Dec);
			  } catch (err) {
				setError(err.message); 
				console.log(error);
			  } 
			};
			fetchSales();
			}, []);
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Revenue</h2>
			</div>

			<div style={{ width: "100%", height: 400 }}>
				<ResponsiveContainer>
					<AreaChart data={revenueData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='month' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Area type='monotone' dataKey='revenue' stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.3} />
						<Area type='monotone' dataKey='target' stroke='#10B981' fill='#10B981' fillOpacity={0.3} />
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default RevenueChart;
