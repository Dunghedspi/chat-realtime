import { CallActionType } from '../constants/actions/call.action';

const initState = {
  isCall: false,
  userCall: "", 
  room_id: -1,
};

const CallReducer = (state = initState, action) => {
  switch (action.type) {
    case CallActionType.IS_CALL_TRUE:
        const { payload } = action;
      return {
        ...state,
        isCall: true,
        userCall: payload.user,
        room_id: payload.room_id
      };
    case CallActionType.IS_CALL_FALSE:
      return {
        ...initState,
      };
    default:
      return {
        ...state,
      };
  }
};
export default CallReducer;
