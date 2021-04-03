import React, { useEffect, useState } from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import './MessageList.css';
import { useSelector } from 'react-redux';
import { Room } from '../../pages/VideoCall';

export default function MessageList(props) {
  const { socket } = props;

  const user = useSelector(state => state.UserReducer);
  const { roomActive, rooms } = useSelector(state => state.RoomReducer);

  const [mine, setMine] = React.useState({});
  React.useEffect(() => {
    const index = roomActive?.users?.findIndex(item => item.id !== user.id);
    if (index > -1) {
      setMine(roomActive.users[index]);
    }
  }, [roomActive]);

  const methodsSendImage = useForm();
  const handleSubmitSendImage = methodsSendImage.handleSubmit;
  const registerSendImage = methodsSendImage.register;

  const navigate = useNavigate();
  const onClick = () => {
    document.getElementById('inputFile').click();
  };
  const sendImage = data => {
    const image = data.image[0];
    var fileReader = new FileReader();
    fileReader.readAsDataURL(image);
    fileReader.onload = () => {
      const arrayBuffer = fileReader.result;
      const payload = {
        user_id: user.id,
        room_id: roomActive.id,
        message: arrayBuffer,
      };
      socket.sendImage(payload);
    };
  };

  const sendMessage = (data, callback) => {
    const payload = {
      user_id: user.id,
      room_id: roomActive.id,
      message: data.message,
    };
    socket.sendMess(payload);
    callback();
  };
  const index = rooms.findIndex(room => room.id === roomActive.id);
  const messages = rooms[index]?.messages;

  const bottomRef = React.useRef();

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: 'smooth',
    });
  };
  React.useEffect(() => {
    scrollToBottom();
  });

  const renderMessages = () => {
    let i = messages?.length - 1;
    let tempMessages = [];
    const flageUser = [];
    while (i >= 0) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.user_id === user.id;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;
      let type = messages[i]?.type;
      let isSend = false;
      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(
          currentMoment.diff(previousMoment),
        );
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }
      const showUser = [];
      if (current.id) {
        const { users } = current;
        if (users?.length === 0) {
          if (isMine === true) {
            isSend = true;
          } else if (current?.id) {
            console.log(current);
            socket.sendReadMessage({
              id: current?.id,
              room_id: roomActive.id,
            });
          }
        }
        for (const item of users) {
          const index = flageUser.findIndex(e => {
            return e === item.id;
          });
          if (index < 0 && item.id !== user.id) {
            showUser.push(item);
            flageUser.push(item.id);
          }
        }
      }
      tempMessages.unshift(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
          type={type}
          mine={mine}
          showUser={showUser}
          isSend={isSend}
        />,
      );
      i -= 1;
    }

    return tempMessages;
  };
  const messageEl = React.useRef(null);

  const handleClickCallVideo = () => {
    const newWindown = window.open(
      `/videocall?room_id=` + roomActive.id,
      '_blank',
      'height=1200,width=1200',
    );
    localStorage.setItem('user-call', 1);
  };
  const sendTyping = event => {
    if (event.target.value) {
      socket.sendTyping({ room_id: roomActive.id });
    }
  };
  const endTyping = () => {
    socket.endTyping({ room_id: roomActive.id });
  };

  return (
    <div className="message-list">
      <Toolbar
        title="Conversation Title"
        rightItems={[
          // <ToolbarButton
          //   key="info"
          //   icon="ion-ios-information-circle-outline"
          // />,
          <ToolbarButton
            key="video"
            icon="ion-ios-videocam"
            onClick={() => handleClickCallVideo()}
          />,
        ]}
      />
      <div className="message-list-container">
        {renderMessages()}
        {roomActive?.isTyping ? (
          <div className="container-chat">
            <span className="circle"></span>
            <span className="circle"></span>
            <span className="circle"></span>
          </div>
        ) : (
          ''
        )}

        <div ref={bottomRef} className="list-bottom"></div>
      </div>
      <Compose
        leftItem={[
          <ToolbarButton key="image" icon="ion-ios-image" onClick={onClick} />,
          // <ToolbarButton key="attach" icon="ion-md-attach" />,
        ]}
        rightItems={[<ToolbarButton key="send" icon="ion-md-send" />]}
        sendMessage={sendMessage}
        sendTyping={sendTyping}
        endTyping={endTyping}
      />
      <form>
        <input
          hidden
          type="file"
          name="image"
          id="inputFile"
          ref={registerSendImage}
          onChange={handleSubmitSendImage(sendImage)}
        />
      </form>
    </div>
  );
}
