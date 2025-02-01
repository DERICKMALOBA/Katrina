

import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
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
        setProducts(data); // Set products to stat
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow-md p-4 rounded-xl">
            <Link to={`/product/${product.id}`} className="text-customGray font-thin text-sm sm:text-base">
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <img src={`http://localhost:5000${product.imageUrls[0]}`} alt={product.name} className="w-full h-32 object-cover rounded" />
              ) : (
                <img src="/default-image.jpg" alt="default" className="w-full h-32 object-cover rounded" />
              )}
            </Link>
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-gray-600">Kshs.{product.price}</p>
            <button className="bg-primaryOrange text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300 hover:opacity-80 hover:shadow-lg">
  Add to Cart
</button>
          </div>
        ))}
       
      </div>
    </div>
  );
}






















