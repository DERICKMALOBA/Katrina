import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem, removeProduct } from "../Redux/CartSlice";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

 

  return (
    <div className="p-6 bg-gray-200 shadow-md">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>

      {cart.items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 bg-slate-100 rounded-lg">
            {cart.items.map((item) => {
             

              return (
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
                    <p className="text-lg font-bold">Ksh {item.discountedPrice}</p>
                    {item.discount > 0 && (
                      <div className="text-primaryBlack font-semibold text-sm mt-2">
                     
                        <span className="line-through text-gray-500">Kshs.  {item.price.toFixed(2)}</span>{" "}
                        Kshs. {item.discountedPrice.toFixed(2)}
                      </div>
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
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Cart Summary</h3>

            <div className="flex justify-between items-center border-b pb-3">
              <p className="text-md font-medium text-gray-600">Total Items:</p>
              <p className="text-lg font-semibold text-gray-900">{cart.totalQuantity}</p>
            </div>

            <div className="flex justify-between items-center border-b py-3">
              <p className="text-md font-medium text-gray-600">Total Price:</p>
              <p className="text-lg font-bold text-green-600">Ksh {cart.totalPrice}</p>
            </div>

            <Link to="/checkout">
              <button className="w-full bg-purple-800 text-white font-medium text-lg px-5 py-3 mt-4 rounded-lg shadow-md hover:bg-purple-600 transition duration-300">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
