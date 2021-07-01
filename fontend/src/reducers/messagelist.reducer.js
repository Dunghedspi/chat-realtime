import { MessageListActionType } from '../constants/actions/messagelist.action';

const initState = {
  messages: []
};

const MessageListReducer = (state = initState, action) => {
  switch (action.type) {
    case MessageListActionType.GET_LIST_MESSAGE:
      return {
        ...state,
        messages: action.payload
      }
    case MessageListActionType.ADD_MESSAGE:
      const {messages} = state;
      messages.push(action.payload);
      return {...state, messages};
    default:
      return {
        ...state,
      };
  }
};
export default MessageListReducer;
