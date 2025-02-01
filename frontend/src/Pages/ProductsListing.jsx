import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa'; // For the wishlist icon
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'; // For rating stars

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/productslist");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data); // Set products to state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>; // Display loading state
  if (error) return <div>Error: {error}</div>; // Display error message if fetch fails

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow-md p-4 rounded-xl hover:shadow-lg transition duration-300">
            <Link to={`/product/${product.id}`} className="text-customGray font-thin text-sm sm:text-base">
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <img src={`http://localhost:5000${product.imageUrls[0]}`} alt={product.name} className="w-full h-32 object-cover rounded" />
              ) : (
                <img src="/default-image.jpg" alt="default" className="w-full h-32 object-cover rounded" />
              )}
            </Link>

            {/* Wishlist Icon */}
            <div className="absolute top-2 right-2">
              <FaHeart className="text-red-500 cursor-pointer hover:text-red-700 transition duration-200" />
            </div>

            {/* Product Name */}
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>

            {/* Discount (if available) */}
            {product.discount && (
              <div className="text-red-500 font-semibold text-sm mt-2">
                <span className="line-through text-gray-500">Kshs. {product.price}</span> Kshs. {product.discount}
              </div>
            )}

            {/* Product Description */}
            <p className="text-gray-600 mt-1">{product.description}</p>

            {/* Product Price */}
            {!product.discount && (
              <p className="text-gray-600 font-semibold mt-1">Kshs. {product.price}</p>
            )}

            {/* Ratings (if available) */}
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
            <button className="bg-primaryOrange text-white font-semibold px-4 py-2 rounded-lg mt-4 w-full transition duration-300 hover:opacity-80 hover:shadow-lg">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
