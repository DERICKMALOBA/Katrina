import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';
import cartReducer from './CartSlice';
import authReducer from './AuthSlice';
import viewedProductsReducer from './viewedProductsSlice';
// import searchReducer from './SearchSlice'; // Import the search slice

// Combine reducers
const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    auth: authReducer,
    // search: searchReducer,
    viewedProducts: viewedProductsReducer, // Add the search reducer
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