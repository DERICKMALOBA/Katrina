import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
export default function ProductList() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); // State to hold products
  const [loading, setLoading] = useState(true); // State for loading state
  const [error, setError] = useState(null); // State for error handling
  // Fetch data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/productslist"); // Change this to your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data); // Set products to state
      } catch (err) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProducts();
  }, []);
  const addToCart = (product) => {
    setCart([...cart, product]);
  };
  if (loading) return <div>Loading...</div>; // Display loading state
  if (error) return <div>Error: {error}</div>; // Display error message if fetch fails
  var x;
var j;
  function image(h){
  x=JSON.parse(h);
  j=x[0];
  return j;
  }
  var g;
  var imp;
  function arri(w){
    g=JSON.parse(w);
  imp=g;
  const ei=encodeURIComponent(JSON.stringify(imp));
    return ei;
  }
  return (
    <div className="p-4">
       {/* Product List */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow-md p-4 rounded-xl">
             <Link to={`/productdet/${product.name}/${product.description}/${arri(product.image1)}`}>
             <img src={image(product.image1)} alt={product.name} className="w-full h-32 object-cover rounded" />    
                      </Link>
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-gray-600">Kshs.{product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

