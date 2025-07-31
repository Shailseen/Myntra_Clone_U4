import {
  applyMiddleware,
  legacy_createStore as createStore,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import { Registerreducer } from "../redux/Register/reducer";
import { bagReducer } from "../redux/Cart/reducer";
import {Homereducer} from "../redux/Home/reducer";
import { loginReducer } from "../redux/login/loginreducer";
import cartReducer from "../redux/cartSlice"; // Import the cartSlice reducer

const rootreducer = combineReducers({
  bag: bagReducer,
  register: Registerreducer,
  home: Homereducer,
  loginreq: loginReducer,
  cart: cartReducer, // Add cartSlice reducer
});

export const store = createStore(rootreducer, compose(applyMiddleware(thunk)));
