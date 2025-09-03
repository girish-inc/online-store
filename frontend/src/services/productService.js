/**
 * Product Service
 * Handles product-related API operations
 */

import api from './api';

class ProductService {
  // Get all products
  async getAllProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  }

  // Get single product by ID
  async getProductById(productId) {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  }

  // Create new product (admin only)
  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  }

  // Update product (admin only)
  async updateProduct(productId, productData) {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  }

  // Delete product (admin only)
  async deleteProduct(productId) {
    try {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  }

  // Search products
  async searchProducts(searchTerm, filters = {}) {
    try {
      const params = {
        search: searchTerm,
        ...filters
      };
      const response = await api.get('/products/search', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search products');
    }
  }

  // Get products by category
  async getProductsByCategory(category) {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products by category');
    }
  }
}

export default new ProductService();