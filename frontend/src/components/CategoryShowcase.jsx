import { Link } from "react-router-dom";
import { FaHeart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../Redux/CartSlice";
import { useState, useEffect } from "react";

const CategoryShowcase = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.wishlist?.items || []);
  
  const categories = [
    {
      id: "outfits",
      name: "Outfits",
      description: "Stylish and comfortable clothing for everyone",
      image: "/images/outfits.jpg",
      link: "/category/Outfits"
    },
    {
      id: "bags",
      name: "Bags",
      description: "Trendy and functional bags for all occasions",
      image: "/images/bags.jpg",
      link: "/category/Bags"
    },
    {
      id: "shoes",
      name: "Shoes",
      description: "Explore a variety of shoes for every season",
      image: "/images/shoes.jpg",
      link: "/category/Shoes"
    }
  ];

  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    categories.forEach(cat => {
      setLoading(prev => ({ ...prev, [cat.name]: true }));
      fetch(`/api/products/super/${cat.name}`)
        .then(res => res.json())
        .then(data => {
          setCategoryProducts(prev => ({
            ...prev,
            [cat.name]: data.super || []
          }));
          setLoading(prev => ({ ...prev, [cat.name]: false }));
        })
        .catch(err => {
          console.error(`Error fetching ${cat.name} products:`, err);
          setLoading(prev => ({ ...prev, [cat.name]: false }));
        });
    });
  }, []);

  const handleWishlistClick = (product) => {
    console.log("Wishlist clicked", product);
  };

  const handleProductClick = (product) => {
    console.log("Product clicked", product);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold text-purple-800">Shop by Category</h2>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="aspect-video bg-gray-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-bold mb-1">
                  {category.name}
                </h3>
                <p className="text-gray-200 text-sm">
                  {category.description}
                </p>
                <button className="mt-3 self-start px-4 py-2 bg-white text-purple-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
                  Shop Now
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryShowcase;
