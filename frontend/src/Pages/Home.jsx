import { useState } from "react";
import OffersCarousel from "../components/OffersCarousel";
import GenderOutfits from "../components/GenderOutfits";
import CategoriesSidebar from "../components/CategoriesSidebar";
import HorizontalFilters from "../components/HorizontalFilters";
import NewArrivals from "../components/NewArrivals";
import CategoryShowcase from "../components/CategoryShowcase";
import ProductCategories from "./ProductsCategory";

const Home = () => {
  const [filters, setFilters] = useState({
    discount: "",
    size: "",
    priceRange: { min: "", max: "" },
    sortBy: ""
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Section - Offers and Gender Outfits */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Offers - 3/4 width on left */}
          <div className="lg:w-full">
            <OffersCarousel />
          </div>
          
          {/* Gender Outfits - 1/4 width on right */}
          {/* <div className="lg:w-1/4 flex flex-col gap-4">
            <GenderOutfits />
          </div> */}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 pb-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Categories Sidebar - Left */}
          <div className="lg:w-1/5">
            <CategoriesSidebar />
          </div>
          
          {/* Main Content - Right */}
          <div className="lg:w-4/5">
            {/* Horizontal Filters */}
            <HorizontalFilters 
              filters={filters}
              setFilters={setFilters}
            />
            
            {/* New Arrivals */}
            <div className="mb-10">
              <NewArrivals filters={filters} />
            </div>
            
            {/* Category Showcase */}
            <CategoryShowcase />
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