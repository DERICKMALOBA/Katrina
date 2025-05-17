import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
const OffersCarousel = () => {
  const [offers, setOffers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    if (offers.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) =>
          prev >= Math.ceil(offers.length / 2) - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [offers]);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev <= 0 ? Math.ceil(offers.length / 2) - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev >= Math.ceil(offers.length / 2) - 1 ? 0 : prev + 1
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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className=" text-center text-purple-800">
              Special Offers
            </h3>
          </div>

          <div className="relative w-full h-96 overflow-hidden rounded-lg">
            {/* Carousel Container */}
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 50}%)` }}
            >
              {offers.map((product) => (
                <div
                  key={product._id || product.id}
                  className="w-1/2 flex-shrink-0 p-2"
                >
                  <div className="bg-white shadow-md p-4 rounded-xl hover:shadow-lg transition duration-300 border border-gray-200 h-full group relative overflow-hidden">
                    <Link
                      to={`/product/${product._id || product.id}`}
                      className="block"
                    >
                      {product.discount > 0 && (
                        <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
                          -{Math.round(product.discount)}% OFF
                        </span>
                      )}
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                        {product.imageUrls?.[0] ? (
                          <>
                            <img
                              src={`http://localhost:5000${product.imageUrls[0]}`}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />

                            {/* 🔼 Price tag moved to top */}
                            <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-sm font-semibold text-purple-800 z-20 shadow-md">
                              {product.discount > 0 ? (
                                <>
                                  <span className="line-through text-gray-500 text-xs">
                                    Kshs. {product.originalPrice}
                                  </span>
                                  <br />
                                </>
                              ) : null}
                              <span className="font-bold text-purple-800 text-sm">
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

                      <div className="p-2">
                        <h3 className="font-medium text-gray-800 truncate">
                          {product.name}
                        </h3>

                        <div className="mt-1">
                          {product.discount > 0 ? (
                            <>
                              <span className="text-gray-500 line-through text-sm">
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

            {/* Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-purple-100 z-20"
            >
              &lt;
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-purple-100 z-20"
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