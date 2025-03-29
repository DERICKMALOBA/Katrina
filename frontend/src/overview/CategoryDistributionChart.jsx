import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";
import { useEffect} from "react";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const CategoryDistributionChart = () => {
	const [error, setError] = useState(null);
	const [out, setOut] = useState(null);
	const [bag, setBag] = useState(null);
	const [shoe, setShoe] = useState(null);
	const [hyg, setHyg] = useState(null);
	const [acce, setAcce] = useState(null);
	const [others, setOthers] = useState(null);
	const categoryData = [
		{ name: "Oufits", value: out },
		{ name: "Bags", value: bag },
		{ name: "Shoes", value:shoe },
		{ name: "Kid's hygiene", value: hyg },
		{ name: "Kid's Accessories", value: acce },
		{ name: "Others", value: others },
	];
	useEffect(() => {
		const fetchUsers = async () => {
		  try {
			const response = await fetch("/api/sales/category"); // Change this to your actual API endpoint
			if (!response.ok) {
			  throw new Error("Failed to fetch products");
			}
			const data = await response.json();
			console.log("Data is:"+data);
			setOut(data.Outfits);
			setBag(data.Bags); 
			setShoe(data.Shoes);
			setHyg(data.Hygiene);
			setAcce(data.Accessories);
			setOthers(data.Others); 
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
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Sales By Category Distribution</h2>
			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<PieChart>
						<Pie
							data={categoryData}
							cx={"50%"}
							cy={"50%"}
							labelLine={false}
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{categoryData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default CategoryDistributionChart;
