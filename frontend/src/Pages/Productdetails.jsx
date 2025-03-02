import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../Redux/CartSlice";
import { useParams, useLocation,useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar, FaStarHalfAlt, FaHeart } from "react-icons/fa"; // Rating stars
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import io from "socket.io-client";
const socket = io("http://localhost:5000");
export default function ProductDetail() {
  const navigate=useNavigate();
 var [messages,setMessages]=useState([]);
 var [newmessage,setNewmessage]=useState([]);
  const cart = useSelector((state) => state.cart); // cart is an object
  const user = useSelector((state) => state.auth.user);
  const [selectedImage, setSelectedImage] = useState(null);
  const [wishlist, setWishlist] = useState({});
  const dispatch = useDispatch();
   var email=user.email;
  const toggleWishlist = (productId) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };
    useEffect(()=>{
      socket.on("receiverbyuser",(data)=>{
        setMessages((prev) => [...prev, data]);
  });
});
  const sendMessage=async(e)=>{
   if(user.email==null)
   {
    navigate("sign-up");
   }
   else
   {
    socket.emit("register",email);
    socket.on("usermessages",(data)=>{
      setMessages(data);
    });
      e.preventDefault();
    if (!newmessage.trim()) return;

    const messageData = { text: newmessage,sender:user.name,Email:user.email,Role:user.role};
     socket.emit("sendtoadmin",messageData);
     setNewmessage("");
  }
};
  socket.on("sendbacktouser",(data)=>{
    setMessages((prev) => [...prev, data]);
});
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
      {/* Left Side - Product Info */}
      <div className="md:col-span-2 space-y-6">
         {/* Display discount if greater than zero */}
         {product.discount > 0 && (
                <span className="absolute top-2 right-2 bg-primaryGreen text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{Math.round(product.discount)}% OFF
                </span>
              )}
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
                                  ${
                                    wishlist[product.id || product._id]
                                      ? "bg-primaryOrange text-white"
                                      : "border border-purple-800 text-purple-600"
                                  }
                                  hover:shadow-primaryOrange/50`}
              >
                <FaHeart />
              </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            {product.discount > 0 && (
                <span className="absolute top-2  bg-primaryGreen text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{Math.round(product.discount)}% OFF
                </span>
              )}

            {product.discount > 0 && (
              <div className="text-primaryBlack font-semibold text-sm mt-2">
                <span className="line-through text-gray-500">
                  Kshs. {originalPrice}
                </span>{" "}
                Kshs. {discountedPrice}
              </div>
            )}

            <p className="text-primaryOrange mt-1 line-clamp-2">
              {product.stock <= 5 ? (
                <span className="text-red-500 font-semibold">
                  {" "}
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
                  {product.rating > 0 ? (
                    product.rating >= index + 1 ? (
                      <FaStar className="text-yellow-500" />
                    ) : product.rating > index && product.rating < index + 1 ? (
                      <FaStarHalfAlt className="text-yellow-500" />
                    ) : (
                      <FaStar className="text-gray-300" />
                    )
                  ) : (
                    <FaStar className="text-gray-300" /> // Display gray stars if rating is 0
                  )}
                </span>
              ))}
            </div>

            <button
              onClick={() => dispatch(addItem(product))}
              disabled={remainingStock === 0}
              className={`px-4 py-2 ${
                remainingStock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primaryOrange hover:bg-orange-600 pt-3"
              } text-white font-bold rounded`}
            >
              {remainingStock === 0 ? "Out of Stock" : "Add to Cart"}
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

        {/*  Customer Feedback */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-3">Customer Feedback</h2>
          <p className="text-gray-600 italic">
            {" "}
            Amazing product! Highly recommended - John Doe
          </p>
        </div>
      </div>

      {/* Right Side - Delivery & Chat */}
      <div className="space-y-6">
        {/*  Delivery Section */}

        {/*  Chat Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <div className="fixed bottom-10 right-10 w-80 bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-3">Need Help?</h2>
          <p className="text-gray-600 mb-4">
            Ask questions about this product:
          </p>
<<<<<<< HEAD
    <div className="h-40 overflow-y-auto border p-2 rounded">
      {messages.map((msg) => {
        const Client = msg.email === user.email;

        return (
          <div
            key={msg.id}
            className={`flex ${Client ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-2 my-1 rounded max-w-[70%] ${
                Client ? "bg-blue-200 text-black" : "bg-gray-200 text-black"
              }`}
            >
              {msg.msg}
            </div>
          </div>
        );
      })}
    </div>
  <form onSubmit={sendMessage} className="flex mt-2">
      <input
        type="text"
        className="flex-1 p-2 border rounded-l"
        placeholder="Type a message..."
        value={newmessage}
        onChange={(e) => setNewmessage(e.target.value)}
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded-r">
        Send
      </button>
    </form>
</div>
=======
          <textarea
            className="w-full p-2 border rounded-lg"
            rows="4"
            placeholder="Type your message..."
          ></textarea>
          <button className="mt-4 bg-purple-800 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
            Send Message
          </button>
>>>>>>> 8d156d236f14c07dad735a4f2d89ee0d16f4b96e
        </div>
      </div>
    </div>
  );
}
