import { UserCheck, UserPlus, UsersIcon} from "lucide-react";
import { motion } from "framer-motion";
import { useState,useEffect} from "react";
import StatCard from "../SharedComponent/StatCard";
import UserGrowthChart from "../users/UserGrowthChart";
import UserActivityHeatmap from "../users/UserActivityHeatmap";
import UsersTable from "../users/UsersTable";
const Customers = () => {
 const [error, setError] = useState(null);
 const [dat, setDat] = useState(null);
 const [n, setN] = useState(null);
useEffect(() => {
const fetchUsers = async () => {
  try {
    const response = await fetch("/api/users/userstotal"); // Change this to your actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    console.log("Data is:"+data);
    setDat(data.size); // Set products to state
  } catch (err) {
    setError(err.message); // Handle errors
    console.log(error);
  } 
};
const fetchNew = async () => {
  try {
    const response = await fetch("/api/users/newusers"); // Change this to your actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const d = await response.json();
    console.log("Data is:"+d);
    setN(d.new); // Set products to state
  } catch (err) {
    setError(err.message); // Handle errors
    console.log(error);
  } 
};
fetchUsers();
fetchNew();

}, []);
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-[#1f2121]'>
		

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
  className='grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8'
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
>
  <StatCard
    name='Total Users'
    icon={UsersIcon}
    value={dat}
    color='#6366F1'
  />
  <StatCard
    name='New Users This Month'
    icon={UserPlus}
    value={n}
    color='#10B981'
  />
  <StatCard
    name='Active Users'
    icon={UserCheck}
    value={"coming soon"}
    color='#F59E0B'
  />
</motion.div>


				<UsersTable/>

				{/* USER CHARTS */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
					<UserGrowthChart />
					<UserActivityHeatmap />
				
				</div>
			</main>
		</div>
	);
};
export default Customers;
