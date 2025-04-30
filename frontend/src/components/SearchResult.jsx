import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItem } from "../Redux/CartSlice";
import Fuse from "fuse.js";
import ReviewsComponent from "./ReviewsComponent";

const Search = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const { searchTerm } = useParams();
  const dispatch = useDispatch();

  // Fetch all products on component mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products/search");

        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setAllProducts(Array.isArray(data.product) ? data.product : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Perform fuzzy search when searchTerm changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts([]);
      return;
    }

    const options = {
      keys: [
        { name: "name", weight: 0.5 },
        { name: "super", weight: 0.3 },
        { name: "subcat", weight: 0.2 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
      shouldSort: true,
      includeMatches: true,
      findAllMatches: true,
      ignoreLocation: true,
    };

    const fuse = new Fuse(allProducts, options);
    const results = fuse.search(searchTerm);

    setFilteredProducts(
      results.map((result) => ({
        ...result.item,
        matchInfo: result.matches,
      }))
    );
  }, [searchTerm, allProducts]);

  // Highlight matching text in results
  const highlightMatches = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.toString().replace(regex, "<mark>$1</mark>");
  };

  // Toggle wishlist
  const handleWishlistClick = (product) => {
    setWishlist((prevWishlist) =>
      prevWishlist.some((item) => item.id === product.id)
        ? prevWishlist.filter((item) => item.id !== product.id)
        : [...prevWishlist, product]
    );
  };

  return (
    <div className="p-4">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
            const isInWishlist = wishlist.some(
              (item) => item.id === product.id
            );
            return (
              <div
                key={product.id || product._id}
                className="bg-white shadow-md p-4 rounded-xl hover:shadow-lg transition duration-300 border border-gray-200"
              >
                <Link
                  to={`/product/${product.id || product._id}`}
                  className="block relative p-2 rounded-lg shadow-lg hover:shadow-xl transition"
                >
                  {/* {product.discount > 0 && (
                    <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{Math.round(product.discount)}% OFF
                    </span>
                  )} */}

                  <img
                    src={
                      product.imageUrls?.length > 0
                        ? `http://localhost:5000${product.imageUrls[0]}`
                        : "/default-image.jpg"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </Link>

                <div className="mt-2 relative">
                  {/* <h2
                    className="text-lg font-semibold truncate w-5/6"
                    dangerouslySetInnerHTML={{
                      __html: highlightMatches(product.name, searchTerm),
                    }}
                  /> */}
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
                      {product.stock} {product.stock === 1 ? "unit" : "units"}{" "}
                      left
                    </span>
                  ) : (
                    <>{product.stock} units left</>
                  )}
                </p>

                <ReviewsComponent productId={product.id || product._id} />

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
      ) : (
        !loading && (
          <div className="text-center py-8">
            <p>
              {searchTerm
                ? "No matching products found. Try a different search term."
                : "No products available."}
            </p>
            {searchTerm && (
              <Link
                to="/product"
                className="text-purple-800 hover:underline mt-2 inline-block"
              >
                Browse All Products
              </Link>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default Search;
