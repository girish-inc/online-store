const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');

// Get all products with pagination / Create a product (admin)
router
  .route('/')
  .get(getProducts)
  .post(protect, admin, upload.single('image'), createProduct);

// Get, update, delete product by ID
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.single('image'), updateProduct)
  .delete(protect, admin, deleteProduct);

// Create product review
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;