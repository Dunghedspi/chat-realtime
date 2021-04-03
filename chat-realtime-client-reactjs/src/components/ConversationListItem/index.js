import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shave from 'shave';
import { RoomAction } from '../../actions/room.action';

import './ConversationListItem.css';

const findUser = (users, user_id) => {
  const index = users.findIndex(user => user.id !== user_id);
  return users[index];
};

export default function ConversationListItem(props) {
  useEffect(() => {
    shave('.conversation-snippet', 50);
  });
  const dispatch = useDispatch();
  const { users, name, messages, id } = props.room;
  const usersReadList = messages?.users;
  const user = useSelector(state => state.UserReducer);
  const { roomActive } = useSelector(state => state.RoomReducer);

  const handleClick = id => {
    dispatch(RoomAction.changeRoomActive(props.room));
  };

  const showMessage = messages => {
    const message = messages.length > 0 ? messages[messages.length - 1] : '';
    let text = '';
    if (message?.type === 'image') {
      text = 'Image';
    } else {
      text = message?.message;
    }

    const showMess = () => {
      const size = message?.users?.length;
      if (size === 0 && message?.user_id === user.id) {
        return (
          <>
            <p className="conversation-snippet no_read">{text}</p>
            <i className="ion-ios-checkmark-circle-outline"></i>
          </>
        );
      } else if (size === 0) {
        return <p className={`conversation-snippet no_read`}>{text}</p>;
      } else if (size) {
        const userRead = message?.users[0];
        return (
          <>
            <p className={`conversation-snippet`}>{text}</p>
            {userRead?.id !== user?.id ? (
              <img src={user?.avatar} className="avatar_user_read" />
            ) : (
              ''
            )}
          </>
        );
      }
    };

    return <div className="message_box_room">{showMess()}</div>;
  };
  const userShow = findUser(users, user.id);
  return (
    <div
      className={`conversation-list-item ${
        roomActive.id === id ? 'active-1' : ''
      }`}
      onClick={() => handleClick(id)}
    >
      <img
        className={`conversation-photo ${
          userShow?.online ? 'border-online' : ''
        }`}
        src={userShow.avatar}
        alt="conversation"
      />
      {userShow?.online ? (
        <img src="./onlineIcon.png" className="onlineIcon" />
      ) : (
        ''
      )}
      <div className="conversation-info">
        <h1 className="conversation-title">{userShow.email}</h1>
        {showMessage(messages)}
      </div>
    </div>
  );
}
