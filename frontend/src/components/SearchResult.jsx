import React, { useEffect, useState } from 'react';
import {  Link } from 'react-router-dom';
import { FaHeart, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { addItem } from '../Redux/CartSlice';

const SearchResults = () => {
const [products,setProducts]=useState([]);

  // Wishlist state
  const [wishlist, setWishlist] = useState({});


  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/products/search?${queryString}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        console.log("Fetched data:", data); // Debugging log

        // Extract the products array from the response object
        setProducts(Array.isArray(data.product) ? data.product: []);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

 

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {products.length > 0 ? (
        <div className="overflow-x-auto whitespace-nowrap mb-8">
          <div className="inline-flex space-x-4">
            {products.map((product) => (
              <div
                key={product.id || product._id}
                className="w-48 bg-white shadow-md p-4 rounded-xl hover:shadow-lg transition duration-300 border border-gray-200"
              >
                <Link to={`/product/${product.id || product._id}`}>
                  {product.discount > 0 && (
                    <span className="absolute top-2 right-2 bg-primaryGreen text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{Math.round(product.discount)}% OFF
                    </span>
                  )}

                  <img
                    src={`http://localhost:5000${product.imageUrls?.[0] || '/default-image.jpg'}`}
                    alt={product.name || 'Product'}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </Link>

                <div className="mt-2 relative">
                  <h2 className="text-lg font-semibold truncate">{product.name}</h2>
                  <button
                    onClick={() =>
                      setWishlist((prev) => ({
                        ...prev,
                        [product.id || product._id]: !prev[product.id || product._id],
                      }))
                    }
                    className={`absolute right-0 p-2 mt-8 rounded-full transition-all duration-300 shadow-lg ${
                      wishlist[product.id || product._id]
                        ? 'bg-purple-800 text-white'
                        : 'border border-purple-800 text-purple-800'
                    }`}
                  >
                    <FaHeart />
                  </button>
                </div>

                <div className="text-primaryBlack font-semibold text-sm mt-2">
                  {product.discount > 0 ? (
                    <>
                      <span className="line-through text-gray-500">Kshs. {product.originalPrice}</span>{' '}
                      Kshs. {product.discountedPrice}
                    </>
                  ) : (
                    <p className="text-gray-600 font-semibold">Kshs. {product.price}</p>
                  )}
                </div>

                <p className="text-purple-800 mt-1">
                  {product.stock <= 5 ? (
                    <span className="text-red-500 font-semibold">{product.stock} units left</span>
                  ) : (
                    `${product.stock} units available`
                  )}
                </p>

                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, index) => (
                    <span key={index}>
                      {product.ratings >= index + 1 ? (
                        <FaStar className="text-yellow-500" />
                      ) : product.ratings > index && product.ratings < index + 1 ? (
                        <FaStarHalfAlt className="text-yellow-500" />
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
            ))}
          </div>
        </div>
      ) : (
        !loading && <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;








// import { useSelector } from "react-redux";

// const SearchResults = () => {
//   const searchResults = useSelector((state) => state.search.results);

//   console.log("Rendering Search Results: ", searchResults);

//   if (!searchResults || searchResults.length === 0) {
//     return <p>No results found</p>;
//   }

//   return (
//     <div>
//       <h2>Search Results</h2>
//       <ul>
//         {searchResults.map((product, index) => (
//           <li key={index}>
//             <h3>{product.name}</h3>
//             <p>{product.description}</p>
//             <p>Price: ${product.price}</p>
//             <p>Category: {product.category}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SearchResults;


// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchSearchResults } from "../Redux/SearchSlice";

// const SearchResults = ({ searchQuery }) => {
//   const dispatch = useDispatch();
//   const { results, loading, error } = useSelector((state) => state.search);

//   useEffect(() => {
//     if (searchQuery) {
//       dispatch(fetchSearchResults({ name: searchQuery })); // Dispatch thunk with search params
//     }
//   }, [dispatch, searchQuery]);
// console.log("results  :"+results);
//   return (
//     <div>
//       <h2>Search Results</h2>
//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: "red" }}>Error: {error}</p>}
//       {results.length === 0 && !loading && <p>No results found</p>}
//       <ul>
//         {results.map((product, index) => (
//           <li key={index}>
//             <h3>{product.name}</h3>
//             <p>{product.description}</p>
//             <p>Price: ${product.price}</p>
//             <p>Category: {product.category}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SearchResults;

