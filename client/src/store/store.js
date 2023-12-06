// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/root';

const store = configureStore({
  reducer: rootReducer,
  // You can add middleware, dev tools, etc. here if needed
});

export default store;
