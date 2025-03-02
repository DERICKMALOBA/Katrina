import { useState, useEffect } from "react";
// Ensure correct import

import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { FaHeart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItem } from "../Redux/CartSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState({});
  const [page, setPage] = useState(1);
  const limit = 40; // Number of products per page
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [discount, setDiscount] = useState("");
  const [size, setSize] = useState("");
  const [rating, setRating] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        let apiUrl = "/api/products/productslist"; // Default to fetching all products
        const queryParams = new URLSearchParams();

        if (discount) {
          apiUrl = "/api/products/discount"; // Change route if filtering by discount
          queryParams.append("discount", discount);
        } else if (size) {
          apiUrl = "/api/products/size"; // Example: You'd need a backend route for size filtering
          queryParams.append("size", size);
        } else if (rating) {
          apiUrl = "/api/products/rating"; // Change route if sorting by rating
        } else if (priceRange.min || priceRange.max) {
          apiUrl = "/api/products/price"; // Use price filtering route
          if (priceRange.min) queryParams.append("minPrice", priceRange.min);
          if (priceRange.max) queryParams.append("maxPrice", priceRange.max);
        }

        // Sorting logic
        if (sortBy) {
          if (sortBy === "low_to_high") {
            apiUrl = "/api/products/price-asc";
          } else if (sortBy === "high_to_low") {
            apiUrl = "/api/products/price-desc";
          } else if (sortBy === "newest") {
            apiUrl = "/api/products/newest";
          }
        }

        const fullUrl = `${apiUrl}?${queryParams.toString()}`;
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        const processedProducts = (
          Array.isArray(data) ? data : data.products || []
        ).map((product) => ({
          ...product,
          originalPrice: product.price,
          discountedPrice:
            product.price - (product.price * (product.discount || 0)) / 100,
        }));
        setProducts(processedProducts);
        console.log(processedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchFilteredProducts();
  }, [size, discount, priceRange.min, priceRange.max, rating, sortBy]);

  const handlePriceFilterClick = async () => {
    try {
      let apiUrl = "/api/products/price";
      const queryParams = new URLSearchParams();

      if (priceRange.min) queryParams.append("minPrice", priceRange.min);
      if (priceRange.max) queryParams.append("maxPrice", priceRange.max);

      const fullUrl = `${apiUrl}?${queryParams.toString()}`;
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      const processedProducts = (
        Array.isArray(data) ? data : data.products || []
      ).map((product) => ({
        ...product,
        originalPrice: product.price,
        discountedPrice:
          product.price - (product.price * (product.discount || 0)) / 100,
      }));
      setProducts(processedProducts);
      console.log(processedProducts);

      // setProducts(Array.isArray(data) ? data : data.products || []);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/products/productslist?page=${page}&limit=${limit}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  // Redirect to home page if no products
  useEffect(() => {
    if (!loading && products.length === 0) {
      navigate("/"); // Redirect to home page
    }
  }, [products, loading, navigate]);

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

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
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Max Price"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primaryOrange"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
              />
              <button
                onClick={handlePriceFilterClick}
                className="w-full bg-purple-800 text-white py-2 rounded-md hover:bg-opacity-90 "
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
              value={discount}
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
              value={size}
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
              <option value="low_to_high">Price: Low to High</option>
              <option value="high_to_low">Price: High to Low</option>
            </select>
          </div>

          {/* Display Products */}

          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {Array.isArray(products) ? (
                products.map((product) => (
                  <div
                    key={product.id || product._id}
                    className="relative bg-white shadow-md p-4 rounded-xl hover:shadow-lg transition duration-300 border border-gray-200"
                  >
                    <Link
                      to={`/product/${product.id || product._id}`}
                      className="block relative p-2 border rounded-lg shadow-lg hover:shadow-xl transition"
                    >
                      {/* Display discount if greater than zero */}
                      {product.discount > 0 && (
                        <span className="absolute top-2 right-2 bg-primaryGreen text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{Math.round(product.discount)}% OFF
                        </span>
                      )}

                      {product.imageUrls?.length > 0 ? (
                        <img
                          src={`http://localhost:5000${product.imageUrls[0]}`}
                          alt={product.name}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      ) : (
                        <img
                          src="/default-image.jpg"
                          alt="default"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      )}
                    </Link>

                    <div className="mt-2 relative">
                      <h2 className="text-lg font-semibold truncate w-5/6">
                        {product.name}
                      </h2>
                      <button
                        onClick={() =>
                          setWishlist((prev) => ({
                            ...prev,
                            [product.id || product._id]:
                              !prev[product.id || product._id],
                          }))
                        }
                        className={`absolute  right-0 p-2 mt-8 rounded-full transition-all duration-300 shadow-lg
                ${
                  wishlist[product.id || product._id]
                    ? "bg-purple-800 text-purple"
                    : "border border-purple-800 text-purple-800"
                }
                hover:shadow-purple-600`}
                      >
                        <FaHeart />
                      </button>
                    </div>

                    {product.discount > 0 ? (
                      <div className="text-primaryBlack font-semibold text-sm mt-2">
                        <span className="line-through text-gray-500">
                          Kshs. {product.originalPrice}
                        </span>{" "}
                        Kshs. {product.discountedPrice}
                      </div>
                    ) : (
                      <p className="text-gray-600 font-semibold mt-1">
                        Kshs. {product.price}
                      </p>
                    )}

                    <p className="text-purple-800 mt-1">
                      {product.stock <= 5 ? (
                        <span className="text-red-500 font-semibold">
                          {product.stock}{" "}
                          {product.stock === 1 ? "unit" : "units"} left
                        </span>
                      ) : (
                        <>{product.stock} units left</>
                      )}
                    </p>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, index) => (
                        <span key={index}>
                          {product.rating > 0 ? (
                            product.rating >= index + 1 ? (
                              <FaStar className="text-yellow-500" />
                            ) : product.rating > index &&
                              product.rating < index + 1 ? (
                              <FaStarHalfAlt className="text-yellow-500" />
                            ) : (
                              <FaStar className="text-gray-300" />
                            )
                          ) : (
                            <FaStar className="text-gray-300" />
                          )}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => dispatch(addItem(product))}
                      className="bg-purple-800 text-white font-semibold px-4 py-2 rounded-lg mt-4 w-full transition duration-300 hover:opacity-80 hover:shadow-lg"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))
              ) : (
                <p>Loading products...</p>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
              >
                Prev
              </button>
              <span className="px-4 py-2">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-gray-300 rounded-lg ml-2"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
