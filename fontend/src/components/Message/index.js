import React from 'react';
import moment from 'moment';
import './Message.css';
import { MessageApi } from '../../apis/MessageApi';
import { useSelector } from 'react-redux';
const baseUrl = process.env.REACT_APP_SERVER_DOMAIN + '/uploads/image/';
const showMessage = (type, message, friendlyTimestamp, callback) => {
  if (type === 'image') {
    return (
      <img
        src={`${baseUrl}${message}`}
        className={'imageChat'}
        onClick={() => callback(`${baseUrl}${message}`)}
      />
    );
  } else {
    return (
      <div className="bubble" title={friendlyTimestamp}>
        {message}
      </div>
    );
  }
};

export default function Message(props) {
  const {
    data,
    isMine,
    startsSequence,
    endsSequence,
    showTimestamp,
    type,
    mine,
    showUser,
    isSend,
  } = props;
  const friendlyTimestamp = moment(data.timestamp).format('LLLL');
  const user = useSelector((state) => state.UserReducer);

  const showModal = (src) => {
    const modal = document.getElementById('myModal');
    const img = document.getElementById('myImg');
    const modalImg = document.getElementById('img01');
    modal.style.display = 'block';
    modalImg.src = src;
  };

  const hiddenModel = () => {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
  };

  const dowloadFile = () => {
    const modalImg = document.getElementById('img01');
    const path = modalImg.src.split('/');
    MessageApi.dowloadFileImage(path[path.length - 1]);
  };
  {
    /*  */
  }
  const showReadMessageUser = (users) => {
    if (isSend && isMine) {
      return <i className="ion-ios-checkmark-circle-outline"></i>;
    } else {
      return (
        <ul className="list-user">
          {users.map((item, index) => {
            return (
              <li key={index}>
                <img
                  className="avatar_user_read"
                  src={process.env.REACT_APP_SERVER_DOMAIN + item.avatar}
                />
              </li>
            );
          })}
        </ul>
      );
    }
  };
  return (
    <>
      <div
        className={[
          'message',
          `${isMine ? 'mine' : ''}`,
          `${startsSequence ? 'start' : ''}`,
          `${endsSequence ? 'end' : ''}`,
        ].join(' ')}
      >
        {showTimestamp && (
          <div className="timestamp"> {friendlyTimestamp} </div>
        )}
        <div className="bubble-container">
          {!isMine ? (
            <img
              src={process.env.REACT_APP_SERVER_DOMAIN + mine?.avatar}
              className="avatarmine"
            />
          ) : (
            ''
          )}
          {showMessage(type, data.message, friendlyTimestamp, (src) =>
            showModal(src),
          )}
        </div>
        <div className="user_read_list">{showReadMessageUser(showUser)}</div>
      </div>
      {type === 'image' ? (
        <div id="myModal" className="modal">
          <i
            className="ion-md-arrow-down dowloadImage"
            onClick={dowloadFile}
          ></i>
          <span className="close" id="close" onClick={hiddenModel}>
            &times;
          </span>
          <img className="modal-content" id="img01" />
        </div>
      ) : (
        ''
      )}
    </>
  );
}
