import { AuthApi } from '../apis/AuthApi';
import { UserActionType } from '../constants/actions/user.action';
import * as toastify from '../utils/toastify';

export const AuthAction = {
  signIn: payload => {
    return {
      type: UserActionType.SET_INFO,
      payload,
    };
  },
};
