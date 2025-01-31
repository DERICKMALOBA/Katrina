import {  ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../SharedComponent/StatCard";
import EditProduct from "../Product/Edit";
import SalesTrendChart from "../Product/SalesTrendChart";
import CategoryDistributionChart from "../overview/CategoryDistributionChart";

function ProductPage() {
  const colors = {
    primaryOrange: "#fc8414",
    primaryBlue: "#307bb5",
    primaryGreen: "#68ad00",
    primaryRed: "#ff2121",
  };
  return (
    <div className="bg-primaryBlack">
      
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <h1>Product</h1>
       
        <motion.div
  className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
>
  <StatCard
    name="Total Sales"
    icon={Zap}
    value="Ksh 2,345"
    color={colors.primaryOrange}
  />
  <StatCard
    name="Customers"
    icon={Users}
    value="1,234"
    color={colors.primaryBlue}
  />
  <StatCard
    name="Total Products"
    icon={ShoppingBag}
    value="567"
    color={colors.primaryGreen}
  />
</motion.div>


        <EditProduct/>

        {/* CHARTS */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <SalesTrendChart/>
          <CategoryDistributionChart/>
					
				</div>

      </main>
    </div>
  );
}

export default ProductPage;
