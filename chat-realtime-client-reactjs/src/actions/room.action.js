import { MessageApi } from '../apis/MessageApi';
import { RoomApi } from '../apis/RoomApi';
import { RoomActionType } from '../constants/actions/room.action';

export const RoomAction = {
  getListRoom: payload => {
    return {
      type: RoomActionType.GET_LIST_ROOM,
      payload,
    };
  },
  changeRoomActive: payload => {
    return {
      type: RoomActionType.CHANGE_ACTIVE_ROOM,
      payload,
    };
  },
  changeTopRoom: payload => {
    return {
      type: RoomActionType.CHANGE_TOP_ROOM,
      payload,
    };
  },
  setMessage: payload => {
    return async dispatch => {
      const messages = await MessageApi.GetListRoom(payload);
      dispatch({
        type: RoomActionType.SET_MESSAGE,
        payload: messages,
      });
    };
  },
  moveTop: payload => {
    return {
      type: RoomActionType.MOVE_TOP_ROOM,
      payload,
    };
  },
  updateTypingActiveRoom: payload => {
    return {
      type: RoomActionType.UPDATE_TYPING_ACTIVE_ROOM,
      payload,
    };
  },
  updateStatusUser: payload => {
    return {
      type: RoomActionType.UPDATE_STATUS_USER,
      payload,
    };
  },
  setUpdateReadMessage: payload => {
    return {
      type: RoomActionType.UPDATE_READ_MESSAGE,
      payload,
    }
  }
};
