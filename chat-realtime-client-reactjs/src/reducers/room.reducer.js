import { RoomAction } from '../actions/room.action';
import { RoomActionType } from '../constants/actions/room.action';
const initState = {
  rooms: [],
  roomActive: {},
};

const RoomReducer = (state = initState, action) => {
  switch (action.type) {
    case RoomActionType.GET_LIST_ROOM:
      return {
        ...state,
        rooms: action.payload,
        roomActive: action.payload.length > 0 ? action.payload[0] : {},
      };

    case RoomActionType.CHANGE_ACTIVE_ROOM:
      return {
        ...state,
        roomActive: action.payload,
      };
    case RoomActionType.CHANGE_TOP_ROOM: {
      const { rooms, roomActive } = state;
      const { payload, sendReadMessage, userId } = action.payload;
      if (payload.room_id === roomActive.id && payload.user_id !== userId) {
        sendReadMessage(payload);
      }
      const roomIndex = rooms.findIndex(item => item.id === payload.room_id);

      if (roomIndex > -1) {
        rooms[roomIndex].messages.push(payload);
        rooms.unshift(...rooms.splice(roomIndex, 1));
      }
      return {
        ...state,
        rooms,
        roomActive,
      };
    }
    case RoomActionType.SET_MESSAGE: {
      const { rooms, roomActive } = state;
      const roomIndex = rooms.findIndex(item => item.id === roomActive.id);
      if (roomIndex > -1) {
        rooms[roomIndex].messages = action.payload;
        roomActive.messages = action.payload;
      }
      return {
        ...state,
        rooms,
        roomActive,
      };
    }
    case RoomActionType.MOVE_TOP_ROOM: {
      const { rooms } = state;
      rooms.unshift(action.payload);
      return {
        ...state,
        rooms,
      };
    }
    case RoomActionType.UPDATE_TYPING_ACTIVE_ROOM: {
      const { roomActive } = state;
      const { room_id } = action.payload;
      if (room_id === roomActive.id) {
        roomActive.isTyping = action.payload?.typing;
      }
      return {
        ...state,
        roomActive,
      };
    }

    case RoomActionType.UPDATE_STATUS_USER: {
      const { user_id, online } = action.payload;
      const { rooms } = state;
      const newListRoom = [];
      for (const room of rooms) {
        const { users } = room;
        const index = users.findIndex(item => item.id === user_id);
        if (index > -1) {
          users[index].online = online;
        }
        newListRoom.push(room);
      }
      return {
        ...state,
        rooms: newListRoom,
      };
    }
    case RoomActionType.UPDATE_READ_MESSAGE: {
      const { rooms } = state;
      const { message_id, room_id, user } = action.payload;
      const index = rooms.findIndex(item => item.id === room_id);
      if (index > -1) {
        const { messages } = rooms[index];
        const i = messages.findIndex(item => item.id === message_id);
        if (i > -1) {
          messages[i].users.push(user);
        }
      }
      return {
        ...state,
        rooms,
      };
    }
    default:
      return {
        ...state,
      };
  }
};
export default RoomReducer;
