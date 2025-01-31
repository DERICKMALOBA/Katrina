import { CheckCircle, Clock, DollarSign, Tag } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../SharedComponent/StatCard";
import OffersTable from "../offers/OffersTable";

const offerStats = {
  totalOffers: "150",
  activeOffers: "120",
  expiredOffers: "30",
  totalDiscount: "12,345",
};

const OffersPage = () => {
  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Offers" icon={Tag} value={offerStats.totalOffers} color="#6366F1" />
          <StatCard name="Active Offers" icon={CheckCircle} value={offerStats.activeOffers} color="#10B981" />
          <StatCard name="Expired Offers" icon={Clock} value={offerStats.expiredOffers} color="#F59E0B" />
          <StatCard name="Total Discount" icon={DollarSign} value={offerStats.totalDiscount} color="#EF4444" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
        </div>

        <OffersTable />
      </main>
    </div>
  );
};

export default OffersPage;
