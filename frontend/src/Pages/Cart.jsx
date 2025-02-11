import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem, clearCart } from "../Redux/CartSlice";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Shopping Cart</h2>

      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b py-2">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm">{item.description}</p>
                <p className="text-sm">Price: ${item.price.toFixed(2)}</p>
                <p className="text-sm">Quantity: {item.quantity}</p>
              </div>
              <button onClick={() => dispatch(addItem(item))} className="px-2 bg-green-500 text-white">+</button>
              <button onClick={() => dispatch(removeItem(item.id))} className="px-2 bg-red-500 text-white">-</button>
            </div>
          ))}

          <p className="mt-4 font-bold">Total Items: {cart.totalQuantity}</p>
          <p className="mt-2 font-bold text-lg">Total Price: ${cart.totalPrice.toFixed(2)}</p>

          <button onClick={() => dispatch(clearCart())} className="bg-red-600 text-white px-4 py-2 mt-2">Clear Cart</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
