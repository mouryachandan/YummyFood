import React, { useEffect, useState } from "react";
import axios from "axios";
import { getFoods } from "../../api/food";
import { useParams, useNavigate } from "react-router-dom";

type Food = {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  
  
};

const FoodByName = () => {
  const { name } = useParams<{ name?: string }>();
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const userId = userData ? JSON.parse(userData).id : null;

  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError("User ID is required. Please log in.");
      setLoading(false);
      return;
    }

    const fetchFoods = async () => {
      try {
        setLoading(true);
        const data = await getFoods();

        const filteredFoods = name
          ? data.filter((food: Food) =>
              food.name.toLowerCase().includes(name.toLowerCase())
            )
          : data;

        setFoods(filteredFoods);
      } catch (err) {
        setError("Error fetching food items. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [name, userId]);

  const onAddToCart = async (food: Food) => {
    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/cart/add", {
        userId,
        foodId: food.id,
      });
      alert("Item added to cart");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart");
    }
  };

  return (
    <div className="p-6 md:p-12 bg-gradient-to-b from-gray-100 to-white">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        {name ? `Food: ${name}` : "Food Items"}
      </h1>

      <section className="py-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
          {name ? `Only ${name} Items` : "Available Food Items"}
        </h2>

        {error && (
          <div className="text-center text-red-500">
            {error}{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500 underline"
            >
              Login
            </button>
          </div>
        )}

        {loading && <p className="text-center text-gray-500">Loading food items...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-5">
          {foods.length > 0 ? (
            foods.map((food) => (
              <div
                key={food.id}
                className="bg-white border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-5 text-center transform hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/food/${food.name}`)}
              >
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">{food.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{food.description}</p>
                <p className="text-red-500 font-bold text-lg mt-2">₹{food.price}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(food);
                  }}
                  className="mt-4 bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition duration-200"
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            !loading && (
              <p className="text-center col-span-full text-gray-500">
                No {name || "food"} items available.
              </p>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default FoodByName;
