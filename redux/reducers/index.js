import { combineReducers } from "redux";
import { taskReducer } from "./taskReducer";
import { infoReducer } from "./infoReducer";

export default combineReducers({
  info: infoReducer,
  task: taskReducer,
});