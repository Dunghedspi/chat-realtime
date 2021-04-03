import { AxiosCustom } from '../../Plugins/axios';

export const RoomApi = {
  GetListRoom: async payload => {
    let rooms = [];
    const response = await AxiosCustom.callApi('GET', `/user-room/${payload}`);
    if (response && response.status === 200) {
      rooms = response.data;
    }
    return rooms;
  },
};
