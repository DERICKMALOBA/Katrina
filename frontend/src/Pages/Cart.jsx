import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem, removeProduct } from "../Redux/CartSlice";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="p-6   bg-gray-200  shadow-md">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart </h2>

      {cart.items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 bg-slate-100 rounded-lg">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b py-4">
                {/* Left Section: Image, Name, Remove Button */}
                <div className="flex items-center gap-4 ml-4">
                  <img
                    src={`http://localhost:5000${item.imageUrls[0]}`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <button
                      onClick={() => dispatch(removeProduct(item.id))}
                      className="text-red-500 flex items-center gap-1 mt-1 hover:text-red-700"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>

                {/* Middle Section: Price, Discount, Quantity Controls */}
                <div className="text-center mr-4">
                  <p className="text-lg font-bold">Ksh {item.price.toFixed(2)}</p>
                  {item.discount && (
                    <p className="text-sm text-green-500">Discount: {item.discount}%</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => dispatch(removeItem(item.id))}
                      className="px-3 py-1 bg-red-500 text-white rounded-md"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(addItem(item))}
                      className="px-3 py-1 bg-green-500 text-white rounded-md"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="w-full md:w-1/3 bg-gray-100  rounded-lg shadow-md ">
            <h3 className="text-lg font-bold mb-3 text-center">Cart Summary</h3>
            <p className="text-md font-semibold mr-5">Total Items: {cart.totalQuantity}</p>
            <p className="text-lg font-bold mr-5">Total Price: Ksh {cart.totalPrice.toFixed(2)}</p>
           
            <button
              className="w-full bg-blue-600 text-white px-4 py-2 mt-2 rounded-md hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
