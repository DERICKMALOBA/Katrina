import {  ShoppingBag, Users, Zap } from "lucide-react";
import  { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import StatCard from "../SharedComponent/StatCard";
import EditProduct from "../Product/Edit";
import SalesTrendChart from "../Product/SalesTrendChart";
import CategoryDistributionChart from "../overview/CategoryDistributionChart";

function ProductPage() {
  const [productCount, setProductCount] = useState(null);
  const [userCount, setUserCount] = useState(null);  

  useEffect(() => {
    // Simulate fetching the product count (replace with an actual API call)
    const fetchProductCount = async () => {
      try {
        // Example fetch call (replace with your actual API)
        const response = await fetch('/api/products/products/count');
        const data = await response.json();
        
        // Set the fetched product count to state
        setProductCount(data.count);  // Assume data.count contains the product count
      } catch (error) {
        console.error('Error fetching product count:', error);
      }
    };

    fetchProductCount();
  }, []);






  const fetchUserCount = async () => {
    try {
      const response = await fetch('/api/users/userstotal');  // Make a GET request to the endpoint
      const data = await response.json();  // Parse the JSON response
      setUserCount(data.size);  // Set the number of users in the state
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };

  useEffect(() => {
    // Fetch the user count when the component mounts
    fetchUserCount();
  }, []);





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
    value={userCount}
    color={colors.primaryBlue}
  />
  <StatCard
    name="Total Products"
    icon={ShoppingBag}
    value={productCount}
    color={colors.primaryGreen}
  />
</motion.div>


        <EditProduct/>

        {/* CHARTS */}
        <motion.div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <SalesTrendChart/>
          <CategoryDistributionChart/>
					
				</motion.div>

      </main>
    </div>
  );
}

export default ProductPage;
