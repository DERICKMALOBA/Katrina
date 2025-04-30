import { ShoppingBag, Users, Zap } from "lucide-react";
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import StatCard from "../SharedComponent/StatCard";
import EditProduct from "../Product/Edit";
import SalesTrendChart from "../Product/SalesTrendChart";
import DistributionChart from "../Product/categorydistribution";

function ProductPage() {
  const [productCount, setProductCount] = useState(null);
  const [userCount, setUserCount] = useState(null);  
  const [sales, setSales] = useState(null); 
  
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch('/api/sales/totalsales');
        const data = await response.json();
        setSales(data.Totalsales);
      } catch (error) {
        console.error('Error fetching product count:', error);
      }
    };
    fetchSales();
  }, []);

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await fetch('/api/products/products/count');
        const data = await response.json();
        setProductCount(data.count);
      } catch (error) {
        console.error('Error fetching product count:', error);
      }
    };
    fetchProductCount();
  }, []);

  const fetchUserCount = async () => {
    try {
      const response = await fetch('/api/users/userstotal');
      const data = await response.json();
      setUserCount(data.size);
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };

  useEffect(() => {
    fetchUserCount();
  }, []);

  const colors = {
    primaryOrange: "#fc8414",
    primaryBlue: "#307bb5",
    primaryGreen: "#68ad00",
    primaryRed: "#ff2121",
  };

  return (
    <div className="bg-[#1f2121] relative"> {/* Added relative positioning here */}
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
       
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Sales"
            icon={Zap}
            value={sales}
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

        {/* EditProduct now appears above other content */}
        <div className="relative z-50"> {/* Wrapper with high z-index */}
          <EditProduct />
        </div>

        {/* CHARTS */}
        <motion.div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <SalesTrendChart/>
          <DistributionChart/>
        </motion.div>
      </main>
    </div>
  );
}

export default ProductPage;