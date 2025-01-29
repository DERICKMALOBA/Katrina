import { useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Smart Watch",
      description: "Latest model with health tracking.",
      price: 120,
      quantity: 1,
      image: "server/product1.jpg",
    },
    {
      id: 2,
      name: "Wireless Headphones",
      description: "Noise-canceling with high-quality sound.",
      price: 80,
      quantity: 2,
      image: "https://via.placeholder.com/100",
    },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + change } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
      {cartItems.length > 0 ? (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b py-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg" />
              <div className="flex-1 ml-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
                <p className="font-bold">Kshs.{item.price}</p>
              </div>
              <div className="flex items-center">
                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 border rounded">
                  <Minus size={16} />
                </button>
                <span className="mx-2 w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 border rounded">
                  <Plus size={16} />
                </button>
              </div>
              <p className="font-bold w-20 text-center">Kshs.{item.price * item.quantity}</p>
              <button onClick={() => removeItem(item.id)} className="text-red-500">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <div className="flex justify-between mt-4 text-lg font-semibold">
            <span>Total:</span>
            <span>Kshs.{totalAmount}</span>
          </div>
          <button className="w-full mt-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
            Checkout
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;

