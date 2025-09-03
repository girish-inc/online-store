const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'cartItems.product'
  );

  if (cart) {
    res.json(cart);
  } else {
    // If no cart exists, create an empty one
    const newCart = await Cart.create({
      user: req.user._id,
      cartItems: [],
      totalPrice: 0,
    });
    res.json(newCart);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  // Validate input
  if (!productId || !quantity || quantity <= 0) {
    res.status(400);
    throw new Error('Product ID and valid quantity are required');
  }

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check stock availability
  if (quantity > product.countInStock) {
    res.status(400);
    throw new Error(`Only ${product.countInStock} items available in stock`);
  }

  // Find user's cart
  let cart = await Cart.findOne({ user: req.user._id });

  // If no cart exists, create one
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [],
      totalPrice: 0,
    });
  }

  // Check if item already in cart
  const existItem = cart.cartItems.find(
    (item) => item.product.toString() === productId
  );

  if (existItem) {
    // Increment quantity if item exists
    const newQuantity = existItem.quantity + quantity;
    
    // Check if updated quantity exceeds stock
    if (newQuantity > product.countInStock) {
      // Set to max available stock if exceeding
      existItem.quantity = product.countInStock;
      res.status(200);
      res.json({ message: `Quantity set to maximum available stock (${product.countInStock})` });
      return;
    }
    
    // Update quantity
    existItem.quantity = newQuantity;
  } else {
    // Add new item to cart
    cart.cartItems.push({
      product: productId,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
    });
  }

  // Calculate total price
  cart.totalPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Save cart
  await cart.save();

  res.status(201).json(cart);
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
  const productId = req.params.id;

  // Find user's cart
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Remove item from cart
  cart.cartItems = cart.cartItems.filter(
    (item) => item.product.toString() !== productId
  );

  // Recalculate total price
  cart.totalPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Save cart
  await cart.save();

  res.json(cart);
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res) => {
  const productId = req.params.id;
  const { quantity } = req.body;

  // Find user's cart
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Find item in cart
  const cartItem = cart.cartItems.find(
    (item) => item.product.toString() === productId
  );

  if (!cartItem) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  // Update quantity
  cartItem.quantity = quantity;

  // Recalculate total price
  cart.totalPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Save cart
  await cart.save();

  res.json(cart);
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  // Find user's cart
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Clear cart items and reset total price
  cart.cartItems = [];
  cart.totalPrice = 0;

  // Save cart
  await cart.save();

  res.json({ message: 'Cart cleared' });
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
};