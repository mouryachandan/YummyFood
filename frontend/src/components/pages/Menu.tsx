import { useEffect, useState } from "react";
import axios from "axios";
import { getFoods } from "../../api/food"; 


type Food = {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  restaurantName: string;  
};

interface MenuProps {
  searchQuery: string;
}

const Menu: React.FC<MenuProps> = ({ searchQuery }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFoods()
      .then((fetchedFoods) => {
        console.log("Fetched Foods:", fetchedFoods); 
        setFoods(fetchedFoods);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching foods:", error);
        setError("Failed to load menu. Please try again.");
        setLoading(false);
      });
  }, []);

  const onAddToCart = async (food: Food) => {
    const userData = localStorage.getItem("user");
    const userId = userData ? JSON.parse(userData).id : null;

    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/cart/add", {
        userId,
        foodId: food.id,
      });
      alert(`${food.name} added to cart!`);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

 
  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center text-gray-500">Loading menu...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="py-12 px-6 bg-gradient-to-b from-gray-100 to-white">
      <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-800">Explore More Food</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <div 
              key={food.id} 
              className="bg-white border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-5 text-center transform hover:scale-105"
            >
              <img
                src={food.imageUrl}
                alt={food.name}
                className="w-full h-52 object-cover rounded-lg"
              />
              <h3 className="font-bold text-lg mt-3 text-gray-800">{food.name}</h3>
              <p className="text-gray-600 font-semibold mt-1">🍽 {food.restaurantName}</p> {/* ✅ Restaurant Name Show */}
              <p className="text-gray-500 mt-1 text-sm">{food.description}</p>
              <p className="text-red-600 font-bold text-lg mt-2">₹{food.price}</p>
              <button
                onClick={() => onAddToCart(food)}
                className="mt-4 bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition duration-200"
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No food items found</p>
        )}
      </div>
    </section>
  );
};

export default Menu;
