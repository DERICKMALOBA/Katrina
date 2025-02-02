import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { useEffect} from "react";
const SalesOverviewChart = () => {
	const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");
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
	const monthlySalesData  = [
		{ month: "Jan", sales: jan },
		{ month: "Feb", sales: feb },
		{ month: "Mar", sales: mar },
		{ month: "Apr", sales: apr },
		{ month: "May", sales: may },
		{ month: "Jun", sales: jun },
		{ month: "Jul", sales: jul },
		{ month: "Aug", sales: aug },
		{ month: "Sep", sales: sep },
		{ month: "Oct", sales: oct },
		{ month: "Nov", sales: nov },
		{ month: "Dec", sales: dec },
	];
	useEffect(() => {
		const fetchUsers = async () => {
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
			setError(err.message); // Handle errors
			console.log(error);
		  } 
		};
		fetchUsers();
		}, []);
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex items-center justify-between mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Sales Overview</h2>

				<select
					className='bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 
          focus:ring-blue-500
          '
					value={selectedTimeRange}
					onChange={(e) => setSelectedTimeRange(e.target.value)}
				>
					<option>This Week</option>
					<option>This Month</option>
					<option>This Quarter</option>
					<option>This Year</option>
				</select>
			</div>

			<div className='w-full h-80'>
				<ResponsiveContainer>
					<AreaChart data={monthlySalesData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='month' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Area type='monotone' dataKey='sales' stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.3} />
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default SalesOverviewChart;
