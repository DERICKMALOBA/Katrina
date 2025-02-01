import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import { AiOutlineHeart } from 'react-icons/ai'; // Whitelist icon
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; // Rating stars
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [county, setCounty] = useState("");
  const [pickupStation, setPickupStation] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/product/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    console.log(`Product ${product.name} added to cart`);
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 text-lg">Error: {error}</div>;
  if (!product) return <div className="text-gray-500 text-lg">Product not found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
      {/* Left Side - Product Info */}
      <div className="md:col-span-2 space-y-6">
        {/*  Product Image & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shadow-lg rounded-lg p-6">
          {/* Image Slider */}
          <div>
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination]}
              className="rounded-lg"
            >
              {product.imageUrls.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`http://localhost:5000${image}`}
                    alt={`Product ${index}`}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="flex flex-col justify-center relative">
            {/* Whitelist Icon */}
            <div className="absolute top-0 right-0 p-2">
              <AiOutlineHeart size={24} className="text-gray-500 hover:text-red-500 cursor-pointer" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-600 mt-2">Discount: 10%</p>
            <p className="text-gray-800 font-semibold text-lg mt-2"> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES' }).format(product.price)}</p>

            {/* Rating Section */}
            <div className="flex items-center space-x-2 mt-2">
              {/* Render Rating Stars */}
              {Array(5).fill().map((_, index) => (
                <span key={index}>
                  {index < 4 ? (
                    <FaStar className="text-yellow-500" />
                  ) : index === 4 && product.rating % 1 !== 0 ? (
                    <FaStarHalfAlt className="text-yellow-500" />
                  ) : (
                    <FaRegStar className="text-yellow-500" />
                  )}
                </span>
              ))}
              <span className="text-gray-600">({product.rating}/5)</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-6 bg-primaryBlue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/*  Product Description */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-3">Product Details</h2>
          <p className="text-gray-700">{product.description}</p>
        </div>

        <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
  <h2 className="text-2xl font-bold mb-3">Product Images</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {product.imageUrls.map((image, index) => (
      <div key={index} className="w-full">
        <img
          src={`http://localhost:5000${image}`}
          alt={`Product image ${index}`}
          className="w-full h-32 object-cover rounded-lg"
        />
      </div>
    ))}
  </div>
</div>


        {/*  Customer Feedback */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-3">Customer Feedback</h2>
          <p className="text-gray-600 italic"> Amazing product! Highly recommended - John Doe</p>
        </div>
      </div>

      {/* Right Side - Delivery & Chat */}
      <div className="space-y-6">
        {/*  Delivery Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <h2 className="text-2xl font-bold mb-3">Delivery Options</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Select County:</label>
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="w-full p-2 border rounded-lg mt-2"
            >
              <option value="">-- Choose County --</option>
              <option value="Nairobi">Nairobi</option>
              <option value="Mombasa">Mombasa</option>
              <option value="Kisumu">Kisumu</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Pickup Station:</label>
            <select
              value={pickupStation}
              onChange={(e) => setPickupStation(e.target.value)}
              className="w-full p-2 border rounded-lg mt-2"
            >
              <option value="">-- Choose Pickup Station --</option>
              <option value="CBD">CBD</option>
              <option value="Westlands">Westlands</option>
              <option value="Thika Road">Thika Road</option>
            </select>
          </div>
        </div>

        {/*  Chat Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <h2 className="text-2xl font-bold mb-3">Need Help?</h2>
          <p className="text-gray-600 mb-4">Ask questions about this product:</p>
          <textarea
            className="w-full p-2 border rounded-lg"
            rows="4"
            placeholder="Type your message..."
          ></textarea>
          <button className="mt-4 bg-primaryGreen text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
            Send Message
          </button>
        </div>
      </div>

      
    </div>
  );
}
