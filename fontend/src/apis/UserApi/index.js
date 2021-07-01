import { AxiosCustom } from '../../Plugins/axios';

export const UserApi = {
  changeAvatar: async payload => {
    let avatarUrl = '';
    const response = await AxiosCustom.sendImage(
      'PUT',
      '/users/upload/avatar',
      payload,
    );
    if (response && response.status === 200) {
      avatarUrl = response.data.avatar;
    }
    return avatarUrl;
  },
  changePassword: async payload => {
    let isChange = false;
    const response = await AxiosCustom.callApi(
      'PUT',
      '/users/changePassword',
      payload,
    );
    if (response && response.status === 200) {
      isChange = true;
    }
    return isChange;
  },
  searchUserByEmail: async payload => {
    let users = [];
    const response = await AxiosCustom.callApi(
      'GET',
      '/users/get-user-list/' + payload.email,
    );
    if (response && response.status === 200) {
      users = response.data;
    }
    console.log(users);
    return users;
  },
  getUserInfo: async () => {
    let user = null;
    const response = await AxiosCustom.callApi('GET', '/users');
    if (response && response.status === 200) {
      user = response.data;
    }
    return user;
  },
};
