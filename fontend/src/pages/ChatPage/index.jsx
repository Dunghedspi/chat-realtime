import React from "react";
import Messenger from "../../components/Messenger";
import { useDispatch, useSelector } from "react-redux";
import { RoomAction } from "../../actions/room.action";
import { MessageAction } from "../../actions/message.action";
import * as io from "socket.io-client";
import { SocketService } from "../../socket";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { UserAction } from "../../actions/user.action";
import { CallAction } from "../../actions/call.action";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.UserReducer);
  const navigation = useNavigate();
  const { roomActive } = useSelector((state) => state.RoomReducer);

  const socketConnection = ((dispatch) => {
    return (userId) => {
      const socketIo = io(process.env.REACT_APP_SERVER_DOMAIN_SOCKET);
      const socketFunction = SocketService(socketIo, dispatch, userId);
      socketFunction.afterConnect({ user_id: user.id });
      socketFunction.joinListRoom({ offset: 0 });
      setSocket(socketFunction);
    };
  })(dispatch);
  React.useEffect(() => {
    dispatch(
      UserAction.getUserInfo(user, () => navigation("/auth"), socketConnection)
    );
  }, []);

  React.useEffect(() => {
    const getListMessage = async () => {
      if (roomActive?.id) {
        dispatch(RoomAction.setMessage(roomActive.id));
      }
    };
    getListMessage();
  }, [roomActive]);

  // React.useEffect(() => {
  //   const socketIo = io(process.env.REACT_APP_SERVER_DOMAIN_SOCKET);
  //   const socketFunction = SocketService(socketIo, dispatch, user.id);
  //   setSocket(socketFunction);
  // }, []);

  const [socket, setSocket] = React.useState("");
  const callState = useSelector((state) => state.CallReducer);
  const { isCall, userCall, room_id } = callState;
  // React.useEffect(() => {
  //   if (socket) {
  //     socket.afterConnect({ user_id: user.id });
  //   }
  // }, [socket]);

  const { rooms } = useSelector((state) => state.RoomReducer);

  // React.useEffect(() => {
  //   if (socket) {
  //     console.log(1);
  //     socket.joinListRoom({ offset: 0 });
  //   }
  // }, [socket]);

  const handleClickYes = (room_id) => {
    const newWindown = window.open(
      `/videocall?room_id=` + room_id,
      "_blank",
      "height=1200,width=1200"
    );
    dispatch(CallAction.setIsCallFalse());
    localStorage.setItem("user-call", 0);
  };

  const handleClickNo = (room_id) => {
    socket.rejectCall({ room_id });
    dispatch(CallAction.setIsCallFalse());
  };

  return (
    <>
      <div className="App">
        <Messenger socket={socket} />
      </div>
      {isCall ? (
        <div className="Call_Modal">
          <div className="User_Call_Box">
            <h1>Có cuộc gọi tới</h1>
            <div className="user_box">
              <div className="avatar_box">
                <img src={userCall.avatar} />
              </div>
              <div className="call-user-info">
                <p>
                  <strong>{userCall.email}</strong> {"đang gọi cho bạn"}
                </p>
                <span>{"Cuộc gọi bắt đầu khi bạn nhấn chấp nhận"}</span>
                <div className="group_button">
                  <button onClick={() => handleClickNo(room_id)}>
                    {"Từ Chối"}
                  </button>
                  <button onClick={() => handleClickYes(room_id)}>
                    {"Chấp Nhận"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
