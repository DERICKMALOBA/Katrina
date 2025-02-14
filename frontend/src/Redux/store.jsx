import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import cartReducer from './CartSlice'; // Import the cartSlice
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlicle from './AuthSlice'; // Import the authSlice

// Combine reducers
const rootReducer = combineReducers({ 
  user: userReducer,
  cart: cartReducer,
  auth: authSlicle, // Add cart reducer
});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persistor
export const persistor = persistStore(store);
