import { useState, useEffect } from "react";
import ProductList from "../Pages/ProductsListing"; // Ensure correct import

const Home = () => {
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [discount, setDiscount] = useState("");
  const [size, setSize] = useState("");
  const [popularity, setPopularity] = useState(""); // This can be removed if not used
  const [rating, setRating] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [products, setProducts] = useState([]);
  
  // Fetch products whenever any filter changes
  useEffect(() => {
    const fetchFilteredProducts = async () => {
        try {
            const queryParams = new URLSearchParams({
                size,
                popularity,
                rating,
                discount,
                minPrice: priceRange.min || "", 
                maxPrice: priceRange.max || "", 
                sortBy,
            });

            const response = await fetch(`/api/products/products?${queryParams}`);
            if (!response.ok) throw new Error("Failed to fetch products");

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    fetchFilteredProducts();
}, [size, discount, priceRange.min, priceRange.max, popularity, rating, sortBy]); // Track min/max separately


  // Button state (only enabled if minPrice and maxPrice are provided)
  const isApplyButtonDisabled = !priceRange.min || !priceRange.max;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex min-h-screen bg-white">
        <aside className="w-1/5 sm:w-1/5 md:w-1/5 lg:w-1/6 bg-white shadow-md p-6 space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="font-medium text-gray-700">Price Range</h3>
            <div className="flex flex-col gap-2">
              <input
                type="number"
                placeholder="Min Price"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primaryOrange"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              />
              <input
                type="number"
                placeholder="Max Price"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primaryOrange"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              />
              <button
                className={`w-full bg-primaryOrange text-white py-2 rounded-md hover:bg-opacity-90 transition ${isApplyButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isApplyButtonDisabled}
              >
                Apply
              </button>
            </div>
          </div>

          {/* Discount Filter */}
          <div>
            <h3 className="font-medium text-gray-700">Discount</h3>
            <select
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-primaryOrange"
              onChange={(e) => setDiscount(e.target.value)}
            >
              <option value="">Select Discount</option>
              <option value="10">Over 10%</option>
              <option value="20">Over 20%</option>
              <option value="30">Over 30%</option>
              <option value="40">Over 40%</option>
              <option value="50">Over 50%</option>
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <h3 className="font-medium text-gray-700">Size</h3>
            <select
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-primaryOrange"
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">Select Size</option>
              <option value="xl">XL</option>
              <option value="xxl">XXL</option>
              <option value="2_years">2 Years</option>
              <option value="3_years">3 Years</option>
            </select>
          </div>
        </aside>

        <main className="w-full sm:w-3/4 md:w-3/4 lg:w-3/4 p-6">
          {/* Sort & Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <select
              className="border p-2 rounded-md focus:ring-2 focus:ring-primaryOrange"
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">Select Size</option>
              <option value="xl">XL</option>
              <option value="xxl">XXL</option>
              <option value="2_years">2 Years</option>
              <option value="3_years">3 Years</option>
            </select>

            <select
              className="border p-2 rounded-md focus:ring-2 focus:ring-primaryOrange"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
              <option value="low_to_high">Price: Low to High</option>
              <option value="high_to_low">Price: High to Low</option>
            </select>
          </div>

          {/* Display Products */}
          <ProductList products={products} />
        </main>
      </div>
    </div>
  );
};

export default Home;
