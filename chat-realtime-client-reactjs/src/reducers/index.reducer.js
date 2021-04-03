import { combineReducers } from "redux";
import RoomReducer from "./room.reducer";
import UserReducer from "./user.reducer";
import MessageListReducer from "./messagelist.reducer";
import CallReducer from "./call.reducer";
const rootReducer = combineReducers({
    RoomReducer,
    UserReducer,
    MessageListReducer,
    CallReducer
});
export default rootReducer;