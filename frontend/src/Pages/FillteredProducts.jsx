import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { addItem, addToWishlist, removeFromWishlist } from "../Redux/CartSlice";
import { addViewedProduct } from "../Redux/viewedProductsSlice";

const FilteredProducts = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.cart.wishlist);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const queryString = queryParams.toString();
        const response = await fetch(`/api/products/filter?${queryString}`);
        if (!response.ok) throw new Error("Failed to fetch filtered products");
        const data = await response.json();

        const processedProducts = (Array.isArray(data) ? data : data.products || []).map((product) => ({
          ...product,
          originalPrice: product.price,
          discountedPrice: product.price - (product.price * (product.discount || 0)) / 100,
        }));

        setProducts(processedProducts);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [location.search]);

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

  if (loading) return <div className="text-center py-8">Loading products...</div>;
  if (!products.length) return <div className="text-center py-8">No products found for this filter</div>;

  return (
    <div className="mb-8">
     
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => {
          const productId = product.id || product._id;
          const isInWishlist = wishlist.some((item) => (item.id || item._id) === productId);
          
          return (
            <div key={productId} className="flex-shrink-0 w-48 bg-white shadow-md p-4 rounded-xl hover:shadow-lg transition duration-300 border border-gray-200">
              <Link
                to={`/product/${productId}`}
                onClick={() => handleProductClick(product)}
                className="block relative p-2  rounded-lg shadow-lg hover:shadow-xl transition"
              >
               
               

                <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                  {product.imageUrls?.[0] ? (
                    <img
                      src={`http://localhost:5000${product.imageUrls[0]}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/default-image.jpg";
                      }}
                    />
                  ) : (
                    <img
                      src="/default-image.jpg"
                      alt="default"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </Link>

              <div className="mt-2 relative">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h2>
                  <div className="flex items-center space-x-2">
                    {product.discount > 0 && (
                      <span className="text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        -{Math.round(product.discount)}% off
                      </span>
                    )}
                    <button
                      onClick={() => handleWishlistClick(product)}
                      className={`p-2 rounded-full transition-all duration-300 shadow-lg ${
                        isInWishlist
                          ? "bg-purple-800 text-white"
                          : "border border-purple-800 text-purple-800"
                      } hover:shadow-purple-600`}
                    >
                      <FaHeart size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {product.discount > 0 ? (
                <div className="text-black font-semibold text-sm mt-2">
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
};

export default FilteredProducts;