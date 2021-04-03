import { UserApi } from '../apis/UserApi';
import { UserActionType } from '../constants/actions/user.action';
import * as toastify from '../utils/toastify';

export const UserAction = {
  changeAvatar: payload => {
    return async dispatch => {
      const avatarUrl = await UserApi.changeAvatar(payload);
      if (avatarUrl) {
        toastify.toastifySuccess('Successful avatar update');
        dispatch({
          type: UserActionType.CHANGE_AVATAR,
          payload: avatarUrl,
        });
      } else {
        toastify.toastifyError('UnSuccessful avatar update');
      }
    };
  },
  changePassword: payload => {
    return async () => {
      const isChange = await UserApi.changePassword(payload);
      if (isChange) {
        toastify.toastifySuccess('Successful UserInfo update');
      } else {
        toastify.toastifyError('UnSuccessful UserInfo update');
      }
    };
  },
  getUserInfo: callback => {
    return async dispatch => {
      const user = await UserApi.getUserInfo();
      if (user) {
        dispatch({
          type: UserActionType.SET_INFO,
          payload: user,
        });
      } else {
        callback();
      }
    };
  },
};
