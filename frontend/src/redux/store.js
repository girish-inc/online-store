import { configureStore } from '@reduxjs/toolkit';

// Import slices
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    user: userReducer,
    cart: cartReducer,
  },
  // Add middleware if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});


export default store;