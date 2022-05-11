import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { createWrapper } from "next-redux-wrapper";
import rootReducer from "./reducers";

// initial states here
const initalState = {};

// middleware
const middleware = [thunk];

const bindMiddleWare = () => {
  if (process.env.NODE_ENV !== 'production') {
    // init dev tool only in dev environment
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

// creating store
// export const store = createStore(
//   rootReducer,
//   initalState,
//   composeWithDevTools(applyMiddleware(...middleware))
// );
export const store = createStore(
  rootReducer,
  initalState,
  bindMiddleWare(middleware)
)

// assigning store to next wrapper
const makeStore = () => store;

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, { debug: true });
