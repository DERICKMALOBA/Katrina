import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { FaHeart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItem } from "../Redux/CartSlice";

export default function ProductList() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState({});
  const [page, setPage] = useState(1);
  const limit = 40; // Number of products per page

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
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {products.map((product) => (
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
                    ? "bg-primaryOrange text-white"
                    : "border border-primaryOrange text-primaryOrange"
                }
                hover:shadow-primaryOrange/50`}
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

            <p className="text-primaryOrange mt-1">
              {product.stock <= 5 ? (
                <span className="text-red-500 font-semibold">
                  {product.stock} {product.stock === 1 ? "unit" : "units"} left
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
                    ) : product.rating > index && product.rating < index + 1 ? (
                      <FaStarHalfAlt className="text-yellow-500" />
                    ) : (
                      <FaStar className="text-gray-300" />
                    )
                  ) : (
                    <FaStar className="text-gray-300" /> // Display gray stars if rating is 0
                  )}
                </span>
              ))}
            </div>

            <button
              onClick={() => dispatch(addItem(product))}
              className="bg-purple text-white font-semibold px-4 py-2 rounded-lg mt-4 w-full transition duration-300 hover:opacity-80 hover:shadow-lg"
            >
              Add to Cart
            </button>
          </div>
        ))}
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
  );
}
