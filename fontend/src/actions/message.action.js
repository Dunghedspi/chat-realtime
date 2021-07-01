import { MessageApi } from '../apis/MessageApi';
import { MessageListActionType } from '../constants/actions/messagelist.action';

export const MessageAction = {
  getListMessage: payload => {
    return async dispatch => {
      const messages = await MessageApi.GetListRoom(payload);
      dispatch({
        type: MessageListActionType.GET_LIST_MESSAGE,
        payload: messages,
      });
    };
  },
  addMessage: payload => {
    return {
      type: MessageListActionType.ADD_MESSAGE,
      payload
    }
  }
};
