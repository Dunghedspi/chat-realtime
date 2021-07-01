import { AxiosCustom } from '../../Plugins/axios';

export const AuthApi = {
  SignUp: async payload => {
    let isSignUp = false;
    const response = await AxiosCustom.callApi('POST', '/users', payload);
    if (response && response.status === 201) {
      isSignUp = true;
    }
    return isSignUp;
  },

  SignIn: async payload => {
    const response = await AxiosCustom.callApi('POST', '/auth/signin', payload);
    let user = "";
    if (response && response.status === 200) {
      const { asset_token } = response.data;
      AxiosCustom.setAuthorization(asset_token);
      user = response.data.user;
    }
    return user;
  },

  ForgotPassword: async payload => {
    let isReset = false;
    const response = await AxiosCustom.callApi('PUT', '/users/forgotpass', payload);
    if(response && response.status === 200){
      isReset = true;
    }
    return isReset;
  }
};
