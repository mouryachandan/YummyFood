const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Food = require("../models/Food");


router.get("/:userId", async (req, res) => {
  try {
  
    const cartItems = await Cart.findAll({
      where: { userId: req.params.userId },
      include: [{ model: Food, as: "Food", attributes: ["name", "price"] }],
    });

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/add", async (req, res) => {
  try {
    const { userId, foodId } = req.body;

    const foodExists = await Food.findByPk(foodId);
    if (!foodExists) return res.status(404).json({ error: "Food item id not found" });

    const cartItem = await Cart.create({ userId, foodId });

    res.status(201).json({ message: "add the card", cartItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/remove/:id", async (req, res) => {
  try {
    const result = await Cart.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ message: "Item is empty" });

    res.json({ message: "remove " });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
