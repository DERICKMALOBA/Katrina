import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addItem, addToWishlist, removeFromWishlist } from "../Redux/CartSlice";
import { addViewedProduct } from "../Redux/viewedProductsSlice";
import ReviewsComponent from "../components/ReviewsComponent";

const NewArrivals = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.cart.wishlist);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch("/api/products/newest");
        if (!response.ok) throw new Error("Failed to fetch new arrivals");
        const data = await response.json();

        const processedProducts = (
          Array.isArray(data) ? data : data.products || []
        ).map((product) => ({
          ...product,
          id: product.id || product._id,
          originalPrice: product.price,
          discountedPrice:
            product.price - (product.price * (product.discount || 0)) / 100,
        }));

        setProducts(processedProducts);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, [filters]);

  const handleProductClick = (product) => {
    dispatch(addViewedProduct(product));
  };

  const handleWishlistClick = (product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id);
    isInWishlist
      ? dispatch(removeFromWishlist(product.id))
      : dispatch(addToWishlist(product));
  };

  if (loading)
    return <div className="text-center py-8">Loading new arrivals...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden my-4">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-purple-800 text-left">
          New Arrivals
        </h2>
      </div>

      {products.length ? (
        <div className="p-4 space-y-6">
          {/* First row */}
          <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
            {products
              .slice(0, Math.ceil(products.length / 2))
              .map((product) => {
                const isInWishlist = wishlist.some(
                  (item) => item.id === product.id
                );
                return (
                  <div className="flex-shrink-0 w-48 bg-white shadow-md p-4 rounded-xl hover:shadow-lg transition duration-300 border border-gray-200">
                  <div className="relative">
                    <Link
                      to={`/product/${product.id}`}
                      onClick={() => handleProductClick(product)}
                      className="block"
                    >
                      {product.imageUrls?.length > 0 ? (
                        <img
                          src={`http://localhost:5000${product.imageUrls[0]}`}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <img
                          src="/default-image.jpg"
                          alt="default"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                    </Link>
                  </div>
                
                  <div className="mt-3 relative">
                    <div className="flex justify-between items-center">
                      <h2 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h2>
                
                      {/* Wishlist Icon and Discount Badge in the same row */}
                      <div className="flex items-center space-x-2">
                        {product.discount > 0 && (
                          <span className=" text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            -{Math.round(product.discount)}%
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
                
                  <div className="mt-2">
                    {product.discount > 0 ? (
                      <div className="text-primaryBlack font-semibold text-xs">
                        <span className="line-through text-gray-500">Kshs. {product.originalPrice}</span>{" "}
                        <span className="text-purple-800">Kshs. {product.discountedPrice}</span>
                      </div>
                    ) : (
                      <p className="text-purple-800 font-semibold text-xs">Kshs. {product.price}</p>
                    )}
                  </div>
                
                  <div className="flex justify-between items-center text-xs text-purple-800 mt-2">
                    <p>
                      {product.stock <= 5 ? (
                        <span className="text-red-500 font-semibold">{product.stock} units left</span>
                      ) : (
                        <>{product.stock} units left</>
                      )}
                    </p>
                
                    <div className="flex items-center space-x-1">
                      <ReviewsComponent productId={product.id} />
                    </div>
                  </div>
                
                  <button
                    onClick={() => dispatch(addItem(product))}
                    className="bg-purple-800 text-white text-sm font-medium px-4 py-2 rounded-lg mt-3 w-full transition duration-300 hover:opacity-80 hover:shadow-lg"
                  >
                    Add to Cart
                  </button>
                </div>
                
                
                
                );
              })}
          </div>

          {/* Second row */}
          <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
            {products.slice(Math.ceil(products.length / 2)).map((product) => {
              const isInWishlist = wishlist.some(
                (item) => item.id === product.id
              );
              return (
                <div className="flex-shrink-0 w-48 bg-white shadow-md p-4 rounded-xl hover:shadow-lg transition duration-300 border border-gray-200">
                <div className="relative">
                  <Link
                    to={`/product/${product.id}`}
                    onClick={() => handleProductClick(product)}
                    className="block"
                  >
                    {product.imageUrls?.length > 0 ? (
                      <img
                        src={`http://localhost:5000${product.imageUrls[0]}`}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <img
                        src="/default-image.jpg"
                        alt="default"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </Link>
                </div>
              
                <div className="mt-3 relative">
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h2>
              
                    {/* Wishlist Icon and Discount Badge in the same row */}
                    <div className="flex items-center space-x-2">
                      {product.discount > 0 && (
                        <span className=" text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          -{Math.round(product.discount)}%
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
              
                <div className="mt-2">
                  {product.discount > 0 ? (
                    <div className="text-primaryBlack font-semibold text-xs">
                      <span className="line-through text-gray-500">Kshs. {product.originalPrice}</span>{" "}
                      <span className="text-purple-800">Kshs. {product.discountedPrice}</span>
                    </div>
                  ) : (
                    <p className="text-purple-800 font-semibold text-xs">Kshs. {product.price}</p>
                  )}
                </div>
              
                <div className="flex justify-between items-center text-xs text-purple-800 mt-2">
                  <p>
                    {product.stock <= 5 ? (
                      <span className="text-red-500 font-semibold">{product.stock} units left</span>
                    ) : (
                      <>{product.stock} units left</>
                    )}
                  </p>
              
                  <div className="flex items-center space-x-1">
                    <ReviewsComponent productId={product.id} />
                  </div>
                </div>
              
                <button
                  onClick={() => dispatch(addItem(product))}
                  className="bg-purple-800 text-white text-sm font-medium px-4 py-2 rounded-lg mt-3 w-full transition duration-300 hover:opacity-80 hover:shadow-lg"
                >
                  Add to Cart
                </button>
              </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          No new arrivals found
        </div>
      )}
    </div>
  );
};

export default NewArrivals;
