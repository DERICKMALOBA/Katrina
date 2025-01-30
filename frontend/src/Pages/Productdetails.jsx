import { ShoppingCart } from "lucide-react";
import { useSearchParams } from "react-router-dom";
const ProductInfo = () => {
  const [searchParams] = useSearchParams();
    const name = searchParams.get("name");
    const description = searchParams.get("description");
    const price = searchParams.get("price");
    console.log("hello matei");
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl overflow-hidden">
        <img
          src={"server/images/product1.jpg"}
          alt={"product image"}
          className="w-full h-96 object-cover"
        />
        <div className="p-6">
         <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <p className="text-lg text-gray-600 mt-2">{description}</p>
          <p className="text-xl font-semibold text-gray-900 mt-4">Kshs.{price}</p>
          <button
            className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            <ShoppingCart size={20} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductInfo;
