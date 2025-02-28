<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-6">
  {/* Left Side - Product Info */}
  <div className="md:col-span-2 space-y-6">
    {/* Product Image & Summary */}
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
                          {product.ratings > 0 ? (
                            product.ratings >= index + 1 ? (
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
                          : "bg-purple-800 hover:bg-purple-600 pt-3"
                      } text-white font-bold rounded`}
                    >
                      {remainingStock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-center relative">
        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
        {product.discount > 0 && (
          <span className="absolute top-2 bg-primaryGreen text-white text-xs font-bold px-2 py-1 rounded-full">
            -{Math.round(product.discount)}% OFF
          </span>
        )}
        <p className="text-primaryOrange mt-1">
          {product.stock <= 5 ? (
            <span className="text-red-500 font-semibold">
              {product.stock} {product.stock === 1 ? "item" : "items"} left
            </span>
          ) : (
            <>{product.stock} in stock</>
          )}
        </p>
        <button
          onClick={() => dispatch(addItem(product))}
          disabled={remainingStock === 0}
          className={`px-4 py-2 ${
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
                <FaStar key={i} className={rev.rating > i ? "text-yellow-500" : "text-gray-300"} />
              ))}
            </div>
            <p className="text-gray-600">{rev.review}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}
    </div>
  </div>

  {/* Right Side - Chat & Delivery */}
  <div className="md:col-span-1 space-y-6">
    {/* Chat Section */}
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
      <h2 className="text-2xl font-bold mb-3">Need Help?</h2>
      <p className="text-gray-600 mb-4">Ask questions about this product:</p>
      <textarea className="w-full p-2 border rounded-lg" rows="4" placeholder="Type your message..."></textarea>
      <button className="mt-4 bg-purple-800 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
        Send Message
      </button>
    </div>
  </div>
</div>
