import { AxiosCustom } from '../../Plugins/axios';

export const MessageApi = {
  GetListRoom: async payload => {
    let messages = [];
    const response = await AxiosCustom.callApi('GET', `/message/${payload}`);
    if (response && response.status === 200) {
      messages = response.data;
    }
    return messages;
  },
  dowloadFileImage: filename => {
    AxiosCustom.dowloadImage('GET', `/file/dowload/${filename}`);
  },
};
