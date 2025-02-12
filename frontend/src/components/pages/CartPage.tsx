import React, { useEffect, useState } from "react";
import axios from "axios";

interface CartItem {
  id: number;
  Food: {
    name: string;
    price: number;
    description: string;
    imageUrl: string;
  } | null;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userdata = localStorage.getItem("user");
  const userId = userdata ? JSON.parse(userdata).id : null;

  useEffect(() => {
    if (!userId) return;
    
    axios
      .get(`http://localhost:5000/api/cart/${userId}`)
      .then((response) => {
        setCart(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        setError("Failed to load cart. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const removeFromCart = (cartItemId: number) => {
    axios
      .delete(`http://localhost:5000/api/cart/remove/${cartItemId}`)
      .then(() => setCart(cart.filter((item) => item.id !== cartItemId)))
      .catch((error) => console.error("Error removing item:", error));
  };

  if (loading) return <p className="text-center">Loading cart...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6">Your Cart</h2>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cart.map((item) =>
            item.Food ? (
              <div key={item.id} className="bg-white shadow-md rounded-lg p-4 text-center">
                <img
                  src={item.Food.imageUrl}
                  
                  alt={item.Food.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="font-bold text-lg mt-2">{item.Food.name}</h3>
                <p className="text-gray-600">{item.Food.description}</p>
                
                <p className="text-red-500 font-bold text-lg mt-2">₹{item.Food.price}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-200"
                >
                  Remove
                </button>
              </div>
            ) : (
              <p key={item.id}>Food details not available</p>
            )
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
