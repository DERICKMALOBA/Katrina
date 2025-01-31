import { UserCheck, UserPlus, UsersIcon} from "lucide-react";
import { motion } from "framer-motion";

import StatCard from "../SharedComponent/StatCard";

import UserGrowthChart from "../users/UserGrowthChart";
import UserActivityHeatmap from "../users/UserActivityHeatmap";
import UsersTable from "../users/UsersTable";

const userStats = {
	totalUsers: 152845,
	newUsersToday: 243,
	activeUsers: 98520,
	
};

const Customers = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
		

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
    value={userStats.totalUsers.toLocaleString()}
    color='#6366F1'
  />
  <StatCard
    name='New Users Today'
    icon={UserPlus}
    value={userStats.newUsersToday}
    color='#10B981'
  />
  <StatCard
    name='Active Users'
    icon={UserCheck}
    value={userStats.activeUsers.toLocaleString()}
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
