import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaStar, FaStarHalfAlt } from "react-icons/fa"; // Icons
import { useDispatch } from "react-redux";
import { addItem } from "../Redux/CartSlice";
import io from "socket.io-client";
import { Helmet } from 'react-helmet-async';
const socket = io("http://localhost:5000");

export default function ProductList() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState({});
  const [page, setPage] = useState(1); // Added pagination state

  const toggleWishlist = (productId) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/productslist");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        console.log("Fetched data:", data); // Debugging log

        // Extract the products array from the response object
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <Helmet>
        <title>Katrina children clothes</title>
        <meta name="description" content="You can buy children clothes from Katrina such as outfits,bags ,swimming costumes,children accessories and body scents"/>
        <meta name='keywords' content="children,bags,shirts,trousers,shirt,shirts,trouser,bag,child,shoes,school,travelling,katrina,Katrina,closet,skirt,skirts,dress,dresses,swim,swimming,boxer,
        boxers,panties,boob,boobs,top,tops,vests,vest,suitcase,back,pack,handbag,handbags,girl,girls,boys,boy,sneaker,sneakers,converse,heel,heels,open,doll,lotions,make up,accessories,poaches,raincoats,watches,trolley,leggings,set,tshirts"/>
      </Helmet>
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {products.map((product) => (
            <div
              key={product.id || product._id}
              className="relative bg-white shadow-md p-4 rounded-xl hover:shadow-lg transition duration-300 border border-gray-200"
            >
              {/* Product Image */}
              <Link to={`/product/${product.id || product._id}`} className="block">
                {product.imageUrls?.length > 0 ? (
                  <img
                    src={`http://localhost:5000${product.imageUrls[0]}`}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ) : (
                  <img src="/default-image.jpg" alt="default" className="w-full h-40 object-cover rounded-lg" />
                )}
              </Link>

              {/* Discount Price */}
              {product.discount > 0 && (
                <div className="absolute top-2 right-2 bg-red-400 text-white text-sm font-semibold px-2 py-1 rounded-md">
                  -{product.discount}% Off
                </div>
              )}

              {/* Product Details */}
              <div className="mt-2 relative">
                {/* Product Name with Ellipsis */}
                <h2 className="text-lg font-semibold truncate w-5/6">{product.name}</h2>

                {/* Wishlist Icon */}
                <button
                  onClick={() => toggleWishlist(product.id || product._id)}
                  className={`absolute right-0 p-2 rounded-full transition-all duration-300 shadow-lg
                    ${wishlist[product.id || product._id] ? "bg-primaryOrange text-white" : "border border-primaryOrange text-primaryOrange"}
                    hover:shadow-primaryOrange/50`}
                >
                  <FaHeart />
                </button>
              </div>

              {/* Price Display */}
              {product.discount > 0 ? (
                <div className="text-primaryBlack font-semibold text-sm mt-2">
                  <span className="line-through text-gray-500">Kshs. {product.originalPrice}</span>{" "}
                  Kshs. {product.discountedPrice}
                </div>
              ) : (
                <p className="text-gray-600 font-semibold mt-1">Kshs. {product.price}</p>
              )}

              {/* Product Description */}
              <p className="text-primaryOrange mt-1 line-clamp-2">
                {product.stock <= 5 ? (
                  <span className="text-red-500 font-semibold"> {product.stock} {product.stock === 1 ? "unit" : "units"} left</span>
                ) : (
                  <>{product.stock} units left</>
                )}
              </p>

              {/* Ratings */}
              {product.rating && (
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, index) => (
                    <span key={index}>
                      {product.rating >= index + 1 ? (
                        <FaStar className="text-yellow-500" />
                      ) : product.rating > index && product.rating < index + 1 ? (
                        <FaStarHalfAlt className="text-yellow-500" />
                      ) : (
                        <FaStar className="text-gray-300" />
                      )}
                    </span>
                  ))}
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={() => dispatch(addItem(product))}
                className="bg-primaryOrange text-white font-semibold px-4 py-2 rounded-lg mt-4 w-full transition duration-300 hover:opacity-80 hover:shadow-lg"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}


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