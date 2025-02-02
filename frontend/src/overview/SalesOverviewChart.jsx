import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";
import { useEffect} from "react";

const SalesOverviewChart = () => {
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
		const salesData = [
	
			{ name: "Jan", sales: jan },
			{ name: "Feb", sales: feb },
			{ name: "Mar", sales: mar },
			{ name: "Apr", sales: apr },
			{ name: "May", sales: may },
			{ name: "Jun", sales: jun },
			{ name: "Jul", sales: jul },
			{ name: "Aug", sales: aug },
			{ name: "Sep", sales: sep },
			{ name: "Oct", sales: oct },
			{ name: "Nov", sales: nov },
			{ name: "Dec", sales: dec },
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
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Sales Overview</h2>

			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<LineChart data={salesData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
						<XAxis dataKey={"name"} stroke='#9ca3af' />
						<YAxis stroke='#9ca3af' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Line
							type='stepAfter'
							dataKey='sales'
							stroke='#6366F1'
							strokeWidth={3}
							dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
							activeDot={{ r: 8, strokeWidth: 2 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default SalesOverviewChart;
