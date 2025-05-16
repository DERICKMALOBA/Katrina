import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
const OffersCarousel = () => {
  const [offers, setOffers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("/api/products/offers");
        const data = await res.json();
        setOffers(Array.isArray(data.offer) ? data.offer : []);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (offers.length > 0) {
      const slidesCount = isMobile ? offers.length : Math.ceil(offers.length / 2);
      const interval = setInterval(() => {
        setCurrentIndex((prev) =>
          prev >= slidesCount - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [offers, isMobile]);

  const prevSlide = () => {
    const slidesCount = isMobile ? offers.length : Math.ceil(offers.length / 2);
    setCurrentIndex((prev) =>
      prev <= 0 ? slidesCount - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    const slidesCount = isMobile ? offers.length : Math.ceil(offers.length / 2);
    setCurrentIndex((prev) =>
      prev >= slidesCount - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
     <Helmet>
                        <title>Katrina children clothes and items offers</title>
                        <meta name="description" content="You can search products by items names and offers"/>
                        <meta name='keywords' content="children,bags,shirts,trousers,shirt,shirts,trouser,bag,child,shoes,school,travelling,katrina,Katrina,closet,skirt,skirts,dress,dresses,swim,swimming,boxer,
            boxers,panties,boob,boobs,top,tops,vests,vest,suitcase,back,pack,handbag,handbags,girl,girls,boys,boy,sneaker,sneakers,converse,heel,heels,open,doll,lotions,make up,accessories,poaches,raincoats,watches,trolley,leggings,set,tshirts,offer,offers"/>
                      </Helmet>
      {offers.length > 0 && (
        <div className="mb-8 px-2 sm:px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-center text-purple-800 text-xl md:text-2xl">
              Special Offers
            </h3>
          </div>

          <div className="relative w-full h-[320px] sm:h-[360px] md:h-[400px] overflow-hidden rounded-lg">
            {/* Carousel Container */}
            <div
              className="flex transition-transform duration-1000 ease-in-out h-full"
              style={{ 
                transform: `translateX(-${currentIndex * (isMobile ? 100 : 50)}%)`,
                width: isMobile ? `${offers.length * 100}%` : `${Math.ceil(offers.length / 2) * 100}%`
              }}
            >
              {offers.map((product) => (
                <div
                  key={product._id || product.id}
                  className={`${isMobile ? 'w-full' : 'w-1/2'} flex-shrink-0 p-1 sm:p-2 h-full`}
                >
                  <div className="bg-white shadow-md p-2 sm:p-3 md:p-4 rounded-xl hover:shadow-lg transition duration-300 border border-gray-200 h-full group relative overflow-hidden flex flex-col">
                    <Link
                      to={`/product/${product._id || product.id}`}
                      className="block flex-grow"
                    >
                      {product.discount > 0 && (
                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
                          -{Math.round(product.discount)}% OFF
                        </span>
                      )}
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative flex-grow">
                        {product.imageUrls?.[0] ? (
                          <>
                            <img
                              src={`http://localhost:5000${product.imageUrls[0]}`}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />

                            {/* Price tag - adjusted for mobile */}
                            <div className={`absolute ${isMobile ? 'top-1 right-1 px-1 py-0.5 text-xs' : 'top-2 right-2 px-2 py-1 text-sm'} bg-white/90 rounded font-semibold text-purple-800 z-20 shadow-md`}>
                              {product.discount > 0 ? (
                                <>
                                  <span className="line-through text-gray-500 text-xxs sm:text-xs">
                                    Kshs. {product.originalPrice}
                                  </span>
                                  <br className="hidden sm:block" />
                                </>
                              ) : null}
                              <span className="font-bold text-purple-800">
                                Kshs. {product.discount > 0 ? product.discountedPrice : product.price}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="p-1 sm:p-2">
                        <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">
                          {product.name}
                        </h3>

                        <div className="mt-1 text-xs sm:text-sm">
                          {product.discount > 0 ? (
                            <>
                              <span className="text-gray-500 line-through">
                                Kshs. {product.originalPrice}
                              </span>
                              <span className="ml-2 font-bold text-purple-800">
                                Kshs. {product.discountedPrice}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-purple-800">
                              Kshs. {product.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrows - made slightly larger on mobile for better touch */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-purple-100 z-20 w-8 h-8 flex items-center justify-center"
              aria-label="Previous slide"
            >
              &lt;
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-purple-100 z-20 w-8 h-8 flex items-center justify-center"
              aria-label="Next slide"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OffersCarousel;