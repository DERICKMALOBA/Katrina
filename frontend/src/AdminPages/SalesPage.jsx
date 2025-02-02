import { motion } from "framer-motion";
import { useState } from "react";
import { useEffect} from "react";
import StatCard from "../SharedComponent/StatCard";
import { CreditCard, DollarSign, ShoppingCart} from "lucide-react";
import SalesOverviewChart from "../sales/SalesOverviewChart";
import SalesByCategoryChart from "../sales/SalesByCategoryChart";
import DailySalesTrend from "../sales/DailySalesTrend";

const SalesPage = () => {
	const [error, setError] = useState(null);
		const [total, setTotal] = useState(null);
		const salesStats = {
			totalRevenue: "Kshs."+total,
			averageOrderValue: " ksh 78.90",
			
			salesGrowth: "12.3%",
		};
		useEffect(() => {
			const fetchSales = async () => {
			  try {
				const response = await fetch("/api/sales/salesrevenue"); // Change this to your actual API endpoint
				if (!response.ok) {
				  throw new Error("Failed to fetch products");
				}
				const data = await response.json();
				console.log("Data is:"+data);
				setTotal(data.Totalrevenue); 
				
			  } catch (err) {
				setError(err.message); // Handle errors
				console.log(error);
			  } 
			};
			fetchSales();
			}, []);
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* SALES STATS */}
				<motion.div
  className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8'
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
>
  <StatCard name='Total Revenue' icon={DollarSign} value={salesStats.totalRevenue} color='#6366F1' />
  <StatCard
    name=' Order Value'
    icon={ShoppingCart}
    value={salesStats.averageOrderValue}
    color='#10B981'
  />
  <StatCard name='Sales Growth' icon={CreditCard} value={salesStats.salesGrowth} color='#EF4444' />
</motion.div>


				<SalesOverviewChart />

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<SalesByCategoryChart />
					<DailySalesTrend />
				</div>
			</main>
		</div>
	);
};
export default SalesPage;
