import { useState } from "react";
import OffersCarousel from "../components/OffersCarousel";
import CategoriesSidebar from "../components/CategoriesSidebar";
import HorizontalFilters from "../components/HorizontalFilters";
import NewArrivals from "../components/NewArrivals";
import ProductCategories from "./ProductsCategory";
import { FiFilter } from "react-icons/fi";

const Home = () => {
  const [filters, setFilters] = useState({
    discount: "",
    size: "",
    priceRange: { min: "", max: "" },
    sortBy: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Section - Offers and Gender Outfits */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Offers - 3/4 width on left */}
          <div className="lg:w-full">
            <OffersCarousel />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 pb-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Categories Sidebar - Left - Hidden on mobile */}
          <div className="hidden lg:block lg:w-1/5">
            <CategoriesSidebar />
          </div>
          
          {/* Main Content - Right */}
          <div className="w-full lg:w-4/5">
            {/* Horizontal Filters - Hidden on mobile */}
            <div className="hidden lg:block">
              <HorizontalFilters 
                filters={filters}
                setFilters={setFilters}
              />
            </div>
            
            {/* Mobile filter button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center"
            >
              <FiFilter size={24} />
            </button>
            
            {/* Mobile filters overlay */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500"
                  >
                    ✕
                  </button>
                </div>
                <HorizontalFilters 
                  filters={filters}
                  setFilters={setFilters}
                />
                <div className="mt-8">
                  <CategoriesSidebar />
                </div>
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-black text-white py-3 rounded-lg"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
            
            {/* New Arrivals */}
            <div className="mb-10">
              <NewArrivals filters={filters} />
            </div>
          
            <div className="mb-10">
              <ProductCategories />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;