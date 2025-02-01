import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useState,useEffect} from "react";


const UserGrowthChart = () => {
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
	const userGrowthData = [
		{ month: "Jan", users: jan },
		{ month: "Feb", users: feb },
		{ month: "Mar", users: mar },
		{ month: "Apr", users: apr },
		{ month: "May", users: may },
		{ month: "Jun", users: jun },
		{ month: "Jul", users: jul },
		{ month: "Aug", users: aug },
		{ month: "Sep", users: sep },
		{ month: "Oct", users: oct },
		{ month: "Nov", users: nov },
		{ month: "Dec", users: dec },
	];
	useEffect(() => {
		const fetchUsers = async () => {
		  try {
			const response = await fetch("/api/users/usersgrowth"); // Change this to your actual API endpoint
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
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>User Growth</h2>
			<div className='h-[320px]'>
				<ResponsiveContainer width='100%' height='100%'>
					<LineChart data={userGrowthData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='month' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Line
							type='monotone'
							dataKey='users'
							stroke='#8B5CF6'
							strokeWidth={2}
							dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
							activeDot={{ r: 8 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default UserGrowthChart;
