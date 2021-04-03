import { CallActionType } from '../constants/actions/call.action';

export const CallAction = {
  setIsCallTrue: (payload) => {
    return {
      type: CallActionType.IS_CALL_TRUE,
      payload
    };
  },
  setIsCallFalse: () => {
    return {
      type: CallActionType.IS_CALL_FALSE,
    };
  },
};
