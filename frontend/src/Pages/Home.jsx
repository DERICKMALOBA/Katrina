import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaHeart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addItem, addToWishlist, removeFromWishlist } from "../Redux/CartSlice";
import { addViewedProduct } from "../Redux/viewedProductsSlice";
import ProductCategories from "./ProductsCategory";

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const { category } = useParams();
  const wishlist = useSelector((state) => state.cart.wishlist);
  const [categoryProducts, setCategoryProducts] = useState({});
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 40;
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [discount, setDiscount] = useState("");
  const [size, setSize] = useState("");
  const [rating, setRating] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [view, setView] = useState(false);
  const categories = [
    "Outfits",
    "Bags",
    "Shoes",
    "Kids Hygiene",
    "Kids Accessories",
    "Others",
  ];

  const handleProductClick = (product) => {
    dispatch(addViewedProduct(product));
    console.log("Product added to viewed products:", product);
  };

  const handleWishlistClick = (product) => {
    const isInWishlist = (wishlist || []).some((item) => item.id === product.id);
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        let apiUrl = "/api/products/productslist";
        const queryParams = new URLSearchParams();

        if (discount) {
          apiUrl = "/api/products/discount";
          queryParams.append("discount", discount);
        } else if (size) {
          apiUrl = "/api/products/size";
          queryParams.append("size", size);
        } else if (rating) {
          apiUrl = "/api/products/rating";
        } else if (priceRange.min || priceRange.max) {
          apiUrl = "/api/products/price";
          if (priceRange.min) queryParams.append("minPrice", priceRange.min);
          if (priceRange.max) queryParams.append("maxPrice", priceRange.max);
        }

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
        Array.isArray(data) ? data.products : data.products || []
      ).map((product) => ({
        ...product,
        originalPrice: product.price,
        discountedPrice:
          product.price - (product.price * (product.discount || 0)) / 100,
      }));
      setProducts(processedProducts);
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

  useEffect(() => {
    if (view === false) {
      const submitview = async () => {
        setLoading(true);
        try {
           fetch(`/api/users/views`);
        } catch (err) {
          console.error("Fetch error:", err.message);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      submitview();
      setView(true);
    }
  }, [page]);

  useEffect(() => {
    if (!loading && products.length === 0) {
      navigate("/");
    }
  }, [products, loading, navigate]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("/api/products/offers");
        if (!response.ok) throw new Error("Failed to fetch offers");
        const data = await response.json();
        setOffers(Array.isArray(data.offer) ? data.offer : []);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    if (category) {
      fetch(`/api/products/super/${category}`)
        .then((res) => res.json())
        .then((data) => {
          setCategoryProducts((prev) => ({
            ...prev,
            [category]: data.super || [],
          }));
        })
        .catch((err) => console.error("Error fetching category products:", err));
    }
  }, [category]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === offers.length / 2 - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [offers.length]);

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Filters for Small Devices */}
      <div className="sm:hidden p-4 bg-white shadow-md">
        <div className="flex flex-wrap gap-2">
          <div className="flex-1">
            <select
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-primaryOrange"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            >
              <option value="">Discount</option>
              <option value="10">Over 10%</option>
              <option value="20">Over 20%</option>
              <option value="30">Over 30%</option>
              <option value="40">Over 40%</option>
              <option value="50">Over 50%</option>
            </select>
          </div>

          <div className="flex-1">
            <select
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-primaryOrange"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">Size</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 Years</option>
              <option value="3 years">3 Years</option>
              <option value="4 years">4 Years</option>
              <option value="5 years">5 year</option>
              <option value="6 years">6 Years</option>
              <option value="7 years">7 Years</option>
              <option value="8 years">8 Years</option>
              <option value="9 years">9 year</option>
              <option value="10 years">10 Years</option>
              <option value="11 years">11 Years</option>
              <option value="12 years">12 Years</option>
              <option value="13 years">13 year</option>
              <option value="14 years">14 Years</option>
              <option value="15 years">15 Years</option>
              <option value="16 years">16 Years</option>
            </select>
          </div>

          <div className="flex-1">
            <select
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-primaryOrange"
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen bg-white">
        {/* Sidebar for Larger Screens */}
        <aside className="hidden sm:block w-1/5 bg-white shadow-md p-6 space-y-6">
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

          <div>
            <h3 className="font-medium text-gray-700">Size</h3>
            <select
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-primaryOrange"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">Select Size</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 Years</option>
              <option value="3 years">3 Years</option>
              <option value="4 years">4 Years</option>
              <option value="5 years">5 year</option>
              <option value="6 years">6 Years</option>
              <option value="7 years">7 Years</option>
              <option value="8 years">8 Years</option>
              <option value="9 years">9 year</option>
              <option value="10 years">10 Years</option>
              <option value="11 years">11 Years</option>
              <option value="12 years">12 Years</option>
              <option value="13 years">13 year</option>
              <option value="14 years">14 Years</option>
              <option value="15 years">15 Years</option>
              <option value="16 years">16 Years</option>
            </select>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="w-full sm:w-3/4 p-6">
          {/* Offers Section */}
          {offers.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Special Offers</h2>
              </div>
              <div className="relative w-full h-96 overflow-hidden rounded-lg">
                {/* Carousel Container */}
                <div
                  className="flex transition-transform duration-1000 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 50}%)` }}
                >
                  {offers.map((product) => (
                    <div
                      key={product.id || product._id}
                      className="w-1/2 flex-shrink-0 p-2"
                    >
                      <div className="bg-white shadow-md p-4 rounded-xl hover:shadow-lg transition duration-300 border border-gray-200 h-full">
                        <Link
                          to={`/product/${product.id || product._id}`}
                          className="block relative p-2 border rounded-lg shadow-lg hover:shadow-xl transition"
                        >
                          {product.discount > 0 && (
                            <span className="absolute top-2 right-2 bg-primaryGreen text-white text-xs font-bold px-2 py-1 rounded-full">
                              -{Math.round(product.discount)}% OFF
                            </span>
                          )}

                          {product.imageUrls?.length > 0 ? (
                            <img
                              src={`http://localhost:5000${product.imageUrls[0]}`}
                              alt={product.name}
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          ) : (
                            <img
                              src="/default-image.jpg"
                              alt="default"
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          )}
                        </Link>

                        <div className="mt-2">
                          <h2 className="text-lg font-semibold truncate w-5/6">
                            {product.name}
                          </h2>
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
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === 0 ? offers.length / 2 - 1 : prev - 1
                    )
                  }
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
                >
                  &lt;
                </button>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === offers.length / 2 - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md hover:bg-opacity-100 transition"
                >
                  &gt;
                </button>
              </div>
            </div>
          )}

          {/* Our Products section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center text-purple-800">
              Our Products
            </h2>
            <div className="overflow-x-auto whitespace-nowrap">
              <div className="inline-flex space-x-4">
                {products
                  .filter((product) => {
                    const offerIds = offers.map(
                      (offer) => offer.id || offer._id
                    );
                    return !offerIds.includes(product.id || product._id);
                  })
                  .map((product) => {
                    const isInWishlist = (wishlist || []).some(
                      (item) => item.id === product.id
                    );
                    return (
                      <div
                        key={product.id || product._id}
                        className="w-48 bg-white shadow-md p-4 rounded-xl hover:shadow-lg transition duration-300 border border-gray-200"
                      >
                        <Link
                          to={`/product/${product.id || product._id}`}
                          onClick={() => handleProductClick(product)}
                          className="block relative p-2 border rounded-lg shadow-lg hover:shadow-xl transition"
                        >
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
                            onClick={() => handleWishlistClick(product)}
                            className={`absolute right-0 p-2 mt-8 rounded-full transition-all duration-300 shadow-lg ${
                              isInWishlist
                                ? "bg-purple-800 text-white"
                                : "border border-purple-800 text-purple-800"
                            } hover:shadow-purple-600`}
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
                              {product.ratings > 0 ? (
                                product.ratings >= index + 1 ? (
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
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Shop by Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Shop by Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((categoryItem) => (
                <div
                  key={categoryItem}
                  onClick={() => navigate(`/category/${categoryItem}`)}
                  className="cursor-pointer bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-lg font-semibold">{categoryItem}</h3>
                </div>
              ))}
            </div>
          </div>

          <ProductCategories />

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
        </main>
      </div>
    </div>
  );
};

export default Home;