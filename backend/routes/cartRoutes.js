const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes are protected
router.use(protect);

// Get cart and add to cart
router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

// Update and remove cart items
router.route('/:id')
  .put(updateCartItem)
  .delete(removeFromCart);

module.exports = router;