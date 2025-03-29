import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem, addToWishlist, removeFromWishlist } from "../Redux/CartSlice";
import { addViewedProduct } from "../Redux/viewedProductsSlice";
import { FaHeart, FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function Subcategories() {
  const { sub } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.cart.wishlist);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/subcategories/${sub}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        
        // Handle different response structures
        const productsData = Array.isArray(data.sub) ? data.sub : [];
        
        if (!productsData.length) {
          console.warn("No products found in response");
        }
        
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching subcategory products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sub]);

  const handleProductClick = (product) => {
    dispatch(addViewedProduct(product));
  };

  const handleWishlistClick = (product) => {
    const productId = product.id || product._id;
    const isInWishlist = wishlist.some((item) => (item.id || item._id) === productId);
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(productId));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!products.length) {
    return <div className="text-center py-8">No products found in this subcategory</div>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-center text-purple-700 capitalize">
        {sub}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => {
          const productId = product.id || product._id;
          const isInWishlist = wishlist.some((item) => (item.id || item._id) === productId);
          
          return (
            <div
              key={productId}
              className="bg-white shadow-md p-4 rounded-xl hover:shadow-lg transition duration-300 border border-gray-200"
            >
              <Link
                to={`/product/${productId}`}
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
                    onError={(e) => {
                      e.target.src = "/default-image.jpg";
                    }}
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
                    {product.stock} {product.stock === 1 ? "unit" : "units"} left
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
                      ) : product.ratings > index && product.ratings < index + 1 ? (
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
  );
}