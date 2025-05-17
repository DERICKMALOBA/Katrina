

import OverviewCards from "../analytics/OverviewCards";
import RevenueChart from "../analytics/RevenueChart";


const AnalyticsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
		

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<OverviewCards />
				<RevenueChart />



				
			</main>
		</div>
	);
};
export default AnalyticsPage;
