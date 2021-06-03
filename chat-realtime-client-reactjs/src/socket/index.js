import { MessageAction } from '../actions/message.action';
import { RoomAction } from '../actions/room.action';
import { CallAction } from '../actions/call.action';

export const SocketService = (socket, dispatch, userId) => {
  //close windown

  window.onbeforeunload = function(e) {
    socket.emit('offline', {});
  };

  socket.on('connect', () => {
    console.log('connected ...');
  });
  socket.on('recvMess', payload => {
    console.log(payload);
    const sendReadMessage = payload => {
      console.log(payload);
      socket.emit('read-message', payload);
    };
    dispatch(RoomAction.changeTopRoom({ payload, sendReadMessage, userId }));
  });
  socket.on('recvRoom', payload => {
    socket.emit('joinRoom', payload);
    dispatch(RoomAction.moveTop(payload));
  });
  socket.on('call-user', payload => {
    const { user } = payload;
    if (user.id !== userId) {
      dispatch(CallAction.setIsCallTrue(payload));
    }
  });

  socket.on('typing', payload => {
    const { room_id } = payload;
    dispatch(RoomAction.updateTypingActiveRoom({ typing: true, room_id }));
  });
  socket.on('endtyping', payload => {
    const { room_id } = payload;
    dispatch(RoomAction.updateTypingActiveRoom({ typing: false, room_id }));
  });
  socket.on('online', payload => {
    const { user_id } = payload;
    dispatch(RoomAction.updateStatusUser({ user_id, online: true }));
  });
  socket.on('offline', payload => {
    const { user_id } = payload;
    dispatch(RoomAction.updateStatusUser({ user_id, online: false }));
  });
  socket.on('rooms', payload => {
    dispatch(RoomAction.getListRoom(payload));
  });
  socket.on('read-message', payload => {
    dispatch(RoomAction.setUpdateReadMessage(payload));
  });

  return {
    sendMess: payload => {
      socket.emit('sendMess', payload);
    },
    joinRoom: payload => {
      socket.emit('joinRoom', payload);
    },
    afterConnect: payload => {
      socket.emit('afterConnect', payload);
    },
    joinListRoom: payload => {
      socket.emit('joinListRoom', payload);
    },
    sendImage: payload => {
      socket.emit('sendImage', payload);
    },
    createRoom: payload => {
      socket.emit('createRoom', payload);
    },
    sendTyping: payload => {
      socket.emit('typing', payload);
    },
    endTyping: payload => {
      socket.emit('endtyping', payload);
    },
    sendReadMessage: payload => {
      socket.emit('read-message', payload);
    },
    rejectCall: payload => {
      socket.emit('reject-call', payload);
    },
  };
};
