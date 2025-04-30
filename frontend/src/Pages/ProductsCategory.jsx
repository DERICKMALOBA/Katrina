import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../Redux/CartSlice";

const ProductCategories = () => {
  const dispatch = useDispatch();
  // Safely access wishlist and offers with fallbacks
  const wishlist = useSelector((state) => state.wishlist?.items || []);
  const offers = useSelector((state) => state.offers?.items || []);

  const categories = [
    "Outfits",
    "Bags",
    "Shoes",
    "Kids Hygiene",
    "Kids Accessories",
    "Others",
  ];

  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState({});

  // Fetch products for each category
  useEffect(() => {
    categories.forEach((cat) => {
      setLoading((prev) => ({ ...prev, [cat]: true }));
      fetch(`/api/products/super/${cat}`)
        .then((res) => res.json())
        .then((data) => {
          setCategoryProducts((prev) => ({
            ...prev,
            [cat]: data.super || [],
          }));
          setLoading((prev) => ({ ...prev, [cat]: false }));
        })
        .catch((err) => {
          console.error(`Error fetching ${cat} products:`, err);
          setLoading((prev) => ({ ...prev, [cat]: false }));
        });
    });
  }, []);

  const handleWishlistClick = (product) => {
    // Your wishlist click handler
    console.log("Wishlist clicked", product);
  };

  const handleProductClick = (product) => {
    // Your product click handler
    console.log("Product clicked", product);
  };

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center text-purple-800">
            {category}
          </h2>

          {loading[category] ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading {category} products...</p>
            </div>
          ) : (
            <div className="overflow-x-auto whitespace-nowrap">
              <div className="inline-flex space-x-4">
                {(categoryProducts[category] || []).length > 0 ? (
                  (categoryProducts[category] || []).map((product) => {
                    const isInWishlist = wishlist.some(
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
                          className="block relative p-2  rounded-lg shadow-lg hover:shadow-xl transition"
                        >
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
                              className="w-full h-full object-cover rounded-lg"
                            />
                          )}
                        </Link>

                        <div className="mt-2 relative">
                          <div className="flex justify-between items-center w-full">
                            <h2 className="text-lg font-semibold truncate flex-1 pr-2">
                              {product.name}
                            </h2>
                            {product.discount > 0 && (
                              <span className="text-green-700 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                                -{Math.round(product.discount)}% OFF
                              </span>
                            )}
                          </div>
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
                  })
                ) : (
                  <div className="w-full text-center py-8 text-gray-500">
                    No products found in {category} category
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductCategories;
