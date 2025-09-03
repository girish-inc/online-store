const Product = require('../models/productModel');
const { uploadImageFromBuffer } = require('../utils/cloudinary');

// @desc    Fetch all products with pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const totalCount = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(limit)
    .skip(skip);

  res.json({
    products,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    hasNextPage: page < Math.ceil(totalCount / limit),
    hasPrevPage: page > 1
  });
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, price, description, brand, category, countInStock, image } = req.body;
    let imageUrl = image || 'https://via.placeholder.com/300x300.png?text=No+Image';

    // Handle image upload if file is provided
    if (req.file) {
      const uploadResult = await uploadImageFromBuffer(req.file.buffer);
      if (uploadResult.success) {
        imageUrl = uploadResult.url;
      } else {
        return res.status(400).json({ message: 'Image upload failed: ' + uploadResult.error });
      }
    }

    const product = new Product({
      name,
      price,
      user: req.user._id,
      image: imageUrl,
      brand,
      category,
      countInStock,
      numReviews: 0,
      description,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Handle image upload if file is provided
      if (req.file) {
        const uploadResult = await uploadImageFromBuffer(req.file.buffer);
        if (uploadResult.success) {
          product.image = uploadResult.url;
        } else {
          return res.status(400).json({ message: 'Image upload failed: ' + uploadResult.error });
        }
      }

      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock || product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};