import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";
import { useEffect} from "react";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const DistributionChart = () => {
	const [error, setError] = useState(null);
	const [top, setTop] = useState(null);
	const [bot, setBot] = useState(null);
	const [dre, setDre] = useState(null);
	const [out, setOut] = useState(null);
	const [sle, setSle] = useState(null);
	const [und, setUnd] = useState(null);
	const [foo, setFoo] = useState(null);
	const [acc, setAcc] = useState(null);
	const [spe, setSpe] = useState(null);
	const [spo, setSpo] = useState(null);
	const categoryData = [
		{ name: "Tops", value: top },
		{ name: "Dressess", value: dre },
		{ name: "Bottoms", value: bot },
		{ name: "Outer Wear", value: out },
		{ name: "Sports Wear", value: spo },
		{ name: "Sleep Wear", value: sle },
		{ name: "Under Wear", value: und },
		{ name: "Foot Wear", value: foo },
		{ name: "Accessories", value: acc },
		{ name: "Special Wear", value: spe },
	];
	useEffect(() => {
		const fetchUsers = async () => {
		  try {
			const response = await fetch("/api/products/productscategory"); // Change this to your actual API endpoint
			if (!response.ok) {
			  throw new Error("Failed to fetch products");
			}
			const data = await response.json();
			console.log("Data is:"+data);
			setTop(data.Top); 
			setBot(data.Bot);
			setDre(data.Dre); 
			setOut(data.Out);
			setSle(data.Sle); 
			setUnd(data.Und);
			setFoo(data.Foo);
			setAcc(data.Acc);
			setSpe(data.Spe); 
			setSpo(data.Spo);
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
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Category Distribution</h2>
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
export default DistributionChart;