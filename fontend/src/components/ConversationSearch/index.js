import React from 'react';
import './ConversationSearch.css';
import { UserApi } from '../../apis/UserApi';
import { useSelector } from 'react-redux';

export default function ConversationSearch(props) {
  const [users, setUsers] = React.useState([]);
  const userState = useSelector(state => state.UserReducer);
  const { socket } = props;
  const handleOnChange = async event => {
    const email = event.target.value;
    const users = await UserApi.searchUserByEmail({ email });
    setUsers(users);
  };

  const handleClick = id => {
    const user = users[id];
    setUsers([]);
    const payload = {
      name: "",
      token: [userState.id, user.id],
      user_id: user.id
    }
    socket.createRoom(payload);
  };
  return (
    <div className="conversation-search">
      <input
        type="search"
        className="conversation-search-input"
        placeholder="Search Messages"
        onChange={event => handleOnChange(event)}
      />
      {users.length > 0 ? (
        <div className="user-search-box">
          {users.map((user, index) => {
            return (
              <div
                onClick={() => handleClick(index)}
                key={index}
                className="user-box"
              >
                <img
                  className="conversation-photo"
                  src={user.avatar}
                  alt="conversation"
                />
                <h1 className="user-email">{user.email}</h1>
              </div>
            );
          })}
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
