import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState,useEffect} from "react";
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

const SalesByCategoryChart = () => {
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
	const salesByCategory = [
		{ name: "Tops", value: top },
		{ name: "Bottoms", value: bot },
		{ name: "Dressers", value: dre },
		{ name: "OuterWear", value: out },
		{ name: "SleepWear", value: sle },
		{ name: "UnderWear", value: und },
		{ name: "FootWear", value: foo },
		{ name: "Accessories", value: acc },
		{ name: "SpecialOccassions", value: spe },
		{ name: "SportWear", value: spo },
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
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>Sales by Category</h2>

			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={salesByCategory}
							cx='50%'
							cy='50%'
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{salesByCategory.map((entry, index) => (
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
export default SalesByCategoryChart;
