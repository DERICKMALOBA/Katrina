import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../Redux/CartSlice";
import { useParams, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar, FaStarHalfAlt, FaHeart } from "react-icons/fa";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MessagePopup from './Chat'; // Adjust the path as necessary

export default function ProductDetail() {
  const cart = useSelector((state) => state.cart);
  const [selectedImage, setSelectedImage] = useState(null);
  const [wishlist, setWishlist] = useState({});
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isChatVisible, setIsChatVisible] = useState(false); // State to control chat visibility

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
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const calculateDiscountedPrice = (product) => {
    if (!product || !product.price)
      return {
        originalPrice: "0.00",
        discountedPrice: "0.00",
        discountAmount: "0.00",
      };

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
  if (!product)
    return <div className="text-gray-500 text-lg">Product not found</div>;

  const cartItem = cart.items.find((item) => item.id === product.id); // Use cart.items
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const remainingStock = product.stock - quantityInCart;

  const handleReviewSubmit = async () => {
    if (!rating || !review) return alert("Please provide a rating and review");

    const newReview = { rating, review };

    try {
      const response = await fetch(`/api/products/product/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      setReviews([...reviews, newReview]);
      setRating(0);
      setReview("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
      {/* Left Side - Product Info */}
      <div className="md:col-span-2 space-y-6">
        {/* Product Image & Summary */}
        <div className="grid grid-cols-1 md:flex md:flex-row gap-6 bg-white shadow-lg rounded-lg p-6">
          {/* Image Slider Section */}
          <div className="w-full md:w-1/2">
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

          {/* Product Details - Positioned to the right */}
          <div className="w-full md:w-1/2 flex flex-col justify-center relative px-4">
            {/* Wishlist Button */}
            <div className="absolute top-0 right-0 p-2">
              <button
                onClick={() => toggleWishlist(product.id || product._id)}
                className={`absolute right-0 p-2 rounded-full transition-all duration-300 shadow-lg ${
                  wishlist[product.id || product._id]
                    ? "bg-primaryOrange text-white"
                    : "border border-purple-800 text-purple-600"
                } hover:shadow-primaryOrange/50`}
              >
                <FaHeart />
              </button>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

            {/* Discount Label */}
            {product.discount > 0 && (
              <span className="absolute top-2 left-0 bg-primaryGreen text-white text-xs font-bold px-2 py-1 rounded-full">
                -{Math.round(product.discount)}% OFF
              </span>
            )}

            {/* Price Details */}
            {product.discount > 0 && (
              <div className="text-primaryBlack font-semibold text-sm mt-2">
                <span className="line-through text-gray-500">Kshs. {originalPrice}</span>{" "}
                Kshs. {discountedPrice}
              </div>
            )}

            {/* Stock Info */}
            <p className="text-primaryOrange mt-1 line-clamp-2">
              {product.stock <= 5 ? (
                <span className="text-red-500 font-semibold">
                  {product.stock} {product.stock === 1 ? "item" : "items"} left
                </span>
              ) : (
                <>{product.stock} in stock</>
              )}
            </p>

            {/* Rating Section */}
            <div className="flex items-center mt-2 mb-2">
              {[...Array(5)].map((_, index) => (
                <span key={index}>
                  {product.ratings > 0 ? (
                    product.ratings >= index + 1 ? (
                      <FaStar className="text-yellow-500" />
                    ) : product.rating > index && product.rating < index + 1 ? (
                      <FaStarHalfAlt className="text-yellow-500" />
                    ) : (
                      <FaStar className="text-gray-300" />
                    )
                  ) : (
                    <FaStar className="text-gray-300" />
                  )}
                </span>
              ))}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => dispatch(addItem(product))}
              disabled={remainingStock === 0}
              className={`px-4 py-2 g-4 ${
                remainingStock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-800 hover:bg-purple-600"
              } text-white font-bold rounded`}
            >
              {remainingStock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Product Description */}
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
                  onClick={() =>
                    setSelectedImage(`http://localhost:5000${image}`)
                  }
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

        {/* Customer Reviews & Ratings */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-3">Rate & Review</h2>
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`cursor-pointer ${rating >= index + 1 ? "text-yellow-500" : "text-gray-300"}`}
                onClick={() => setRating(index + 1)}
              />
            ))}
          </div>
          <textarea
            className="w-full p-2 border rounded-lg"
            rows="4"
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
          <button className="mt-3 px-4 py-2 bg-purple-800 text-white rounded" onClick={handleReviewSubmit}>
            Submit Review
          </button>
        </div>

        {/* Display Reviews */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-3">Customer Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((rev, index) => (
              <div key={index} className="border-b py-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={product.ratings > i ? "text-yellow-500" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-gray-600">{product.reviews}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>

      {/* Right Side - Delivery & Chat */}
      <div className="md:col-span-1 space-y-6">
        {/* Chat Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <h2 className="text-2xl font-bold mb-3">Need Help?</h2>
          <p className="text-gray-600 mb-4">
            Ask questions about this product:
          </p>
          <button 
            onClick={() => setIsChatVisible(!isChatVisible)} 
            className="mt-4 bg-primaryGreen text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Send Message
          </button>
        </div>
      </div>

      {/* Chat Popup */}
      {isChatVisible && <MessagePopup />}
    </div>
  );
}