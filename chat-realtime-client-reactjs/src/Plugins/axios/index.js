import axios from 'axios';
import QueryString from 'qs';

const axiosCustom = () => {
  const instance = axios.create({
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Origin': process.env.REACT_APP_DOMAIN_CLIENT,
    },
    baseURL: process.env.REACT_APP_SERVER_DOMAIN,
    withCredentials: true,
  });

  const handleSuccess = response => {
    return response;
  };
  const handleError = error => {
    console.log(error);
    return Promise.reject(error);
  };

  instance.interceptors.request.use(handleSuccess, handleError);

  return {
    callApi: async (method, url, payload, params) => {
      instance.defaults.headers['Content-Type'] = 'application/json';
      try {
        const result = await instance({
          method,
          url,
          data: JSON.stringify(payload),
          params: QueryString.stringify(params) || null,
        });
        return result;
      } catch (error) {
        console.error(error);
      }
    },
    setAuthorization: token => {
      instance.defaults.headers['Authorization'] = `bearer ${token}`;
    },
    sendImage: async (method, url, payload) => {
      instance.defaults.headers['Content-Type'] = 'multipart/form-data';
      try {
        const result = await instance({
          method,
          url,
          data: payload,
        });
        return result;
      } catch (error) {
        console.error(error.message);
      }
    },
    dowloadImage: async (method, url, payload) => {
      const instanceDowloadImage = instance;
      instanceDowloadImage.defaults.responseType = 'stream';
      instanceDowloadImage.defaults.headers['Content-Type'] =
        'application/octet-stream';
      await instanceDowloadImage({
        method,
        url,
      });
    },
  };
};
export const AxiosCustom = axiosCustom();
