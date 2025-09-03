import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Helper function to set cart items in local storage
const setCartItemsToStorage = (cartItems) => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

// Get cart items from localStorage
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

// Async thunks for cart actions
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ id, qty }, { getState, rejectWithValue }) => {
    try {
      // Validate id before making API call
      if (!id) {
        return rejectWithValue('Product ID is required');
      }
      
      // First get product details
      const { data: product } = await api.get(`/api/products/${id}`);

      // Call backend cart API to add item (if user is authenticated)
      const { user } = getState();
      if (user && user.userInfo) {
        try {
          await api.post(
            '/api/cart',
            {
              productId: id,
              quantity: qty,
            }
          );
        } catch (apiError) {
          // If API call fails, continue with localStorage only
          console.warn('Cart API call failed, using localStorage only:', apiError.message);
        }
      }

      // Create cart item for local state
      const cartItem = {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty,
      };

      const { cart } = getState();
      const existItem = cart.cartItems.find((x) => x.product === cartItem.product);

      let updatedCartItems;

      if (existItem) {
        // Update the quantity by adding the new qty to the existing qty
        const updatedItem = {
          ...cartItem,
          qty: existItem.qty + cartItem.qty
        };
        // Make sure quantity doesn't exceed stock
        if (updatedItem.qty > updatedItem.countInStock) {
          updatedItem.qty = updatedItem.countInStock;
        }
        updatedCartItems = cart.cartItems.map((x) =>
          x.product === existItem.product ? updatedItem : x
        );
      } else {
        updatedCartItems = [...cart.cartItems, cartItem];
      }

      setCartItemsToStorage(updatedCartItems);
      return updatedCartItems;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id, { getState, rejectWithValue }) => {
    try {
      // Call backend cart API to remove item (if user is authenticated)
      const { user } = getState();
      if (user && user.userInfo) {
        try {
          await api.delete(`/api/cart/${id}`);
        } catch (apiError) {
          // If API call fails, continue with localStorage only
          console.warn('Cart API call failed, using localStorage only:', apiError.message);
        }
      }

      const { cart } = getState();
      const updatedCartItems = cart.cartItems.filter((x) => x.product !== id);
      setCartItemsToStorage(updatedCartItems);
      return updatedCartItems;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const saveShippingAddress = createAsyncThunk(
  'cart/saveShippingAddress',
  async (data) => {
    localStorage.setItem('shippingAddress', JSON.stringify(data));
    return data;
  }
);

export const savePaymentMethod = createAsyncThunk(
  'cart/savePaymentMethod',
  async (data) => {
    localStorage.setItem('paymentMethod', JSON.stringify(data));
    return data;
  }
);

// Get shipping address from localStorage
const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

// Get payment method from localStorage
const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
  ? JSON.parse(localStorage.getItem('paymentMethod'))
  : '';

const initialState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: paymentMethodFromStorage,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      localStorage.removeItem('cartItems');
      state.cartItems = [];
    },
    clearShippingAddress: (state) => {
      localStorage.removeItem('shippingAddress');
      state.shippingAddress = {};
    },
    clearPaymentMethod: (state) => {
      localStorage.removeItem('paymentMethod');
      state.paymentMethod = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Save shipping address
      .addCase(saveShippingAddress.fulfilled, (state, action) => {
        state.shippingAddress = action.payload;
      })
      // Save payment method
      .addCase(savePaymentMethod.fulfilled, (state, action) => {
        state.paymentMethod = action.payload;
      });
  },
});

export const { clearCart, clearShippingAddress, clearPaymentMethod } =
  cartSlice.actions;
export default cartSlice.reducer;