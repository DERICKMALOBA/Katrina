import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, addToWishlist, removeFromWishlist } from "../Redux/CartSlice";
import { useParams, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar, FaStarHalfAlt, FaHeart } from "react-icons/fa";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from 'react-router-dom';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MessagePopup from "./Chat"; // Adjust the path as necessary
import ReviewsComponent from "../components/ReviewsComponent";

export default function ProductDetail() {
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart);
  const [selectedImage, setSelectedImage] = useState(null);
  const wishlist = useSelector((state) => state.cart.wishlist);
const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isChatVisible, setIsChatVisible] = useState(false); // State to control chat visibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsChatVisible(false);
      }
    };

    if (isChatVisible) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isChatVisible]);

  const handleWishlistClick = (product) => {
    const isInWishlist = (wishlist || []).some(
      (item) => item.id === product.id
    );
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
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
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/products/reviewsget/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setReviews(data);
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
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
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const handleReviewSubmit = async () => {
    // Validate rating and review
    if (typeof rating !== "number" || typeof review !== "string") {
      return alert("Please provide a valid rating (number) and review (text)");
    }

    if (rating < 1 || rating > 5) {
      return alert("Rating must be between 1 and 5");
    }

    // Include user_id in the request body
    const newReview = {
      ratings: Number(rating),
      reviews: review,
      name: user.name,
    };

    try {
      const response = await fetch(`/api/products/reviewssubmit/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      // Update the local state with the new review
      setReviews([...reviews, newReview]);
      setRating(0);
      setReview("");
    } catch (err) {
      alert(err.message);
    }
  };
const handleChatClick = () => {
  if (!user) {
    // Store the current product URL to return after login
    navigate("/sign-in", { 
      state: { 
        from: `/product/${id}`,  // Current product page URL
        message: "Please log in to send a message to the seller" 
      } 
    });
  } else {
    setIsChatVisible(true);
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
              {product.imageUrls?.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`http://localhost:5000${image}`}
                    alt={`Product ${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Product Details - Positioned to the right */}
          <div className="w-full md:w-1/2 flex flex-col justify-center relative px-4">
            {/* Wishlist Button */}
            <div className="absolute top-0 right-0 p-2 sm:pt-10 mr-5">
              <button
                onClick={() => handleWishlistClick(product)}
                className={`absolute right-0 p-2 mt-8 rounded-full transition-all duration-300 shadow-lg ${
                  isInWishlist
                    ? "bg-purple-800 text-white"
                    : "border border-purple-800 text-purple-800"
                } hover:shadow-purple-600`}
              >
                <FaHeart />
              </button>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

            {/* Discount Label */}
            {product.discount > 0 && (
              <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full z-20 sm:right-auto sm:left-3 sm:top-3">
                -{Math.round(product.discount)}% OFF
              </span>
            )}

            {/* Price Details */}
            {product.discount > 0 && (
              <div className="text-primaryBlack font-semibold text-sm mt-3">
                <span className="line-through text-gray-500">
                  Kshs. {originalPrice}
                </span>{" "}
                Kshs. {discountedPrice}
              </div>
            )}

            {/* Stock Info */}
            <p className="text-primaryOrange mt-3 line-clamp-2 ">
              {product.stock <= 5 ? (
                <span className="text-red-500 font-semibold">
                  {product.stock} {product.stock === 1 ? "item" : "items"} left
                </span>
              ) : (
                <>{product.stock} in stock</>
              )}
            </p>

            {/* Rating Section */}
            <ReviewsComponent productId={product.id || product._id} />

            {/* Add to Cart Button */}
            <button
              onClick={() => dispatch(addItem(product))}
              disabled={remainingStock === 0}
              className={`px-4 py-2 g-4 mt-3 ${
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
            {product.imageUrls?.map((image, index) => (
              <div key={index} className="w-full">
                <img
                  src={`http://localhost:5000${image}`}
                  alt={`Product image ${index}`}
                  className="w-full h-full object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
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
        <div className="bg-white shadow-lg rounded-lg p-6 mt-3">
          <h2 className="text-2xl font-bold mb-3">Rate & Review</h2>
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`cursor-pointer ${
                  rating >= index + 1 ? "text-yellow-500" : "text-gray-300"
                }`}
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
          <button
            className="mt-3 px-4 py-2 bg-purple-800 text-white rounded"
            onClick={handleReviewSubmit}
          >
            Submit Review
          </button>
        </div>

        {/* Display Reviews */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-3">Customer Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((rev, index) => (
              <div key={index} className="border-b flex flex-row gap-6 py-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        rev.ratings > i ? "text-yellow-500" : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <p className="text-gray-600">{rev.reviews}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet</p>
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
      onClick={handleChatClick}
      className="mt-4 bg-purple-900 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
    >
      Send Message
    </button>
  </div>
</div>

{/* Chat Popup - Only show if user is logged in */}
{isChatVisible && user && (
  <div
    className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50"
    onClick={() => setIsChatVisible(false)}
  >
    <div onClick={(e) => e.stopPropagation()}>
      <MessagePopup />
    </div>
  </div>
)}

      {/* Chat Popup */}
      {isChatVisible && (
        <div
          className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsChatVisible(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <MessagePopup />
          </div>
        </div>
      )}
    </div>
  );
}
