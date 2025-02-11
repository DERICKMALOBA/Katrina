import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../Redux/CartSlice";
import { useParams, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart } from 'react-icons/fa'; // Rating stars
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductDetail() {

  const [selectedImage, setSelectedImage] = useState(null);
  const [wishlist, setWishlist] = useState({});
  const dispatch = useDispatch();

  const toggleWishlist = (productId) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state || {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [county, setCounty] = useState("");
  const [pickupStation, setPickupStation] = useState("");

  

  useEffect(() => {
    console.log("Product Details:", product);
  }, [product]);

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



  const calculateDiscountedPrice = (product) => {
    if (!product || !product.price) return { originalPrice: "0.00", discountedPrice: "0.00", discountAmount: "0.00" };

    const discountPercentage = parseFloat(product.discount) || 0;
    const originalPrice = parseFloat(product.price) || 0;
    const discountAmount = (discountPercentage / 100) * originalPrice;
    const discountedPrice = originalPrice - discountAmount;

    return {
      originalPrice: originalPrice.toFixed(2),
      discountedPrice: discountedPrice.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
    };
  };

  const { originalPrice, discountedPrice } = calculateDiscountedPrice(product);

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

               <button
                                onClick={() => toggleWishlist(product.id || product._id)}
                                className={`absolute  right-0 p-2  rounded-full transition-all duration-300 shadow-lg
                                  ${wishlist[product.id || product._id] ? "bg-primaryOrange text-white" : "border border-primaryOrange text-primaryOrange"}
                                  hover:shadow-primaryOrange/50`}
                              >
                                <FaHeart />
                              </button>
              

            </div>
            
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          
            {product.discount > 0 && (
  <div className="text-primaryBlack font-semibold text-sm mt-2">
    <span className="line-through text-gray-500">Kshs. {originalPrice}</span>{" "}
    Kshs. {discountedPrice}
  </div>
)}


<p className="text-primaryOrange mt-1 line-clamp-2">
  {product.stock <= 5 ? (
    <span className="text-red-500 font-semibold"> {product.stock} {product.stock === 1 ? "unit" : "units"} left</span>
  ) : (
    <>{product.stock} in stock</>
  )}
</p>

         
            
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
             onClick={() => dispatch(addItem(product))}
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
              className="w-full h-32 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => setSelectedImage(`http://localhost:5000${image}`)}
            />
          </div>
        ))}
      </div>

      {/* Zoomed Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Zoomed product"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
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
  <option value="Baringo">Baringo</option>
  <option value="Bomet">Bomet</option>
  <option value="Bungoma">Bungoma</option>
  <option value="Busia">Busia</option>
  <option value="Elgeyo Marakwet">Elgeyo Marakwet</option>
  <option value="Embu">Embu</option>
  <option value="Garissa">Garissa</option>
  <option value="Homa Bay">Homa Bay</option>
  <option value="Isiolo">Isiolo</option>
  <option value="Kajiado">Kajiado</option>
  <option value="Kakamega">Kakamega</option>
  <option value="Kericho">Kericho</option>
  <option value="Kiambu">Kiambu</option>
  <option value="Kilifi">Kilifi</option>
  <option value="Kirinyaga">Kirinyaga</option>
  <option value="Kisii">Kisii</option>
  <option value="Kisumu">Kisumu</option>
  <option value="Kitui">Kitui</option>
  <option value="Kwale">Kwale</option>
  <option value="Laikipia">Laikipia</option>
  <option value="Lamu">Lamu</option>
  <option value="Machakos">Machakos</option>
  <option value="Makueni">Makueni</option>
  <option value="Mandera">Mandera</option>
  <option value="Marsabit">Marsabit</option>
  <option value="Meru">Meru</option>
  <option value="Migori">Migori</option>
  <option value="Mombasa">Mombasa</option>
  <option value="Murang'a">Murang a</option>
  <option value="Nairobi">Nairobi</option>
  <option value="Nakuru">Nakuru</option>
  <option value="Nandi">Nandi</option>
  <option value="Narok">Narok</option>
  <option value="Nyamira">Nyamira</option>
  <option value="Nyandarua">Nyandarua</option>
  <option value="Nyeri">Nyeri</option>
  <option value="Samburu">Samburu</option>
  <option value="Siaya">Siaya</option>
  <option value="Taita Taveta">Taita Taveta</option>
  <option value="Tana River">Tana River</option>
  <option value="Tharaka Nithi">Tharaka Nithi</option>
  <option value="Trans Nzoia">Trans Nzoia</option>
  <option value="Turkana">Turkana</option>
  <option value="Uasin Gishu">Uasin Gishu</option>
  <option value="Vihiga">Vihiga</option>
  <option value="Wajir">Wajir</option>
  <option value="West Pokot">West Pokot</option>
</select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Select a Vehicle For Delivery</label>
            <select
              value={pickupStation}
              onChange={(e) => setPickupStation(e.target.value)}
              className="w-full p-2 border rounded-lg mt-2"
            >
              <option value="">Choose a Vehicle from Your Preferred Sacco</option>
              <option value="CBD">Kangaroo Shutle </option>
              <option value="Westlands">North Rifth</option>
              <option value="Thika Road">North Ways</option>
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

