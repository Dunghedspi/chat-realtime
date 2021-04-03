import { UserActionType } from '../constants/actions/user.action';

const initState = {
  email: '',
  avatar: '',
  isLogin: false,
};

const UserReducers = (state = initState, action) => {
  switch (action.type) {
    case UserActionType.SET_INFO:
      return {
        ...state,
        ...action.payload,
        isLogin: true,
      };
    case UserActionType.RESET_INFO:
      return {
        ...initState,
      };
    case UserActionType.CHANGE_AVATAR: {
      return {
        ...state,
        avatar: action.payload
      }
    }
    default:
      return {
        ...state,
      };
  }
};
export default UserReducers;
