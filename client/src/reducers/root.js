// reducers/index.js
import { combineReducers } from 'redux';
import userReducer from './userReducer';
// Import other reducers as needed

const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducer slices here
});

export default rootReducer;
