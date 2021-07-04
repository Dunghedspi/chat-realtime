import { OrganismsMain } from '../../components/organisms';
import {
  MoleculesLocalVideo,
  MoleculesRemoteVideo,
  MoleculesVideoControls,
} from '../../components/molecules';
import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import qs from 'qs';
import { useLocation } from 'react-router-dom';
import { createPeerConnectionContext } from '../../utils/peer-video-connection';

function useQuery() {
  return qs.parse(useLocation().search, { ignoreQueryPrefix: true });
}

const senders = [];
let peerVideoConnection;
export const Room = () => {
  const params = useQuery();
  const [userMediaStream, setUserMediaStream] = useState(null);
  const [startTimer, setStartTimer] = useState(false);
  const [displayMediaStream, setDisplayMediaStream] = useState(null);
  const [isFullScreen, setFullScreen] = useState(false);
  const [userCallReject, setUserCallReject] = useState({});
  const [turnOff, setTurnOff] = useState(false);
  const localVideo = useRef();
  const remoteVideo = useRef();
  const mainRef = useRef();
  const [disable, setDisable] = React.useState(false);
  useEffect(() => {
    peerVideoConnection = createPeerConnectionContext();
  }, []);

  useEffect(() => {
    const createMediaStream = async () => {
      let stream;
      if (!userMediaStream) {
        try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { min: 640, ideal: 1920 },
            height: { min: 400, ideal: 1080 },
            aspectRatio: { ideal: 1.7777777778 },
          },
          audio: true,
        });
        }catch(error){
          setDisable(true);
        }

        if (localVideo) {
          localVideo.current.srcObject = stream;
        }
        stream.getTracks().forEach(track => {
          senders.push(
            peerVideoConnection.peerConnection.addTrack(track, stream),
          );
        });

        setUserMediaStream(stream);
      }
    };

    createMediaStream();
  }, [userMediaStream]);

  useEffect(() => {
    peerVideoConnection.onAnswerMade(room_id =>
      peerVideoConnection.callUser(room_id),
    );
    peerVideoConnection.onCallRejected(data =>
      alert(`User: "Socket: ${data.socket}" rejected your call.`),
    );
    peerVideoConnection.onTrack(
      stream => (remoteVideo.current.srcObject = stream),
    );

    peerVideoConnection.onResolveCall(room_id => {
      peerVideoConnection.callUser(room_id);
    });
    peerVideoConnection.onConnected(() => {
      setStartTimer(true);
    });
    peerVideoConnection.onDisconnected(() => {
      setStartTimer(false);
      remoteVideo.current.srcObject = null;
    });
    peerVideoConnection.onRejectCall(user => {
      setUserCallReject(user);
      setTimeout(() => {
        window.close();
      }, 2500);
    });
    peerVideoConnection.onListenStateChange(() => {
      peerVideoConnection.turnOffVideoCall();
      setTurnOff(true);
    });
  }, []);

  useEffect(() => {
    const isCall = parseInt(localStorage.getItem('user-call'));
    if (isCall === 0) {
      peerVideoConnection.resolveCall(params.room_id);
    } else {
      peerVideoConnection.callUserBeforeConnect(params.room_id);
    }
  }, []);

  async function shareScreen() {
    const stream =
      displayMediaStream || (await navigator.mediaDevices.getDisplayMedia());

    await senders
      .find(sender => sender.track.kind === 'video')
      .replaceTrack(stream.getTracks()[0]);

    stream.getVideoTracks()[0].addEventListener('ended', () => {
      cancelScreenSharing(stream);
    });

    localVideo.current.srcObject = stream;

    setDisplayMediaStream(stream);
  }

  async function cancelScreenSharing(stream) {
    await senders
      .find(sender => sender.track.kind === 'video')
      .replaceTrack(
        userMediaStream.getTracks().find(track => track.kind === 'video'),
      );

    localVideo.current.srcObject = userMediaStream;
    stream.getTracks().forEach(track => track.stop());
    setDisplayMediaStream(null);
  }

  function fullScreen() {
    setFullScreen(true);
    const elem = mainRef.current;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }

  function cancelFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  function handleFullScreen(isFullScreen) {
    setFullScreen(isFullScreen);
    if (isFullScreen) {
      fullScreen();
    } else {
      cancelFullScreen();
    }
  }

  async function handleScreenSharing(isScreenShared) {
    if (isScreenShared) {
      await shareScreen();
    } else {
      await cancelScreenSharing(displayMediaStream);
    }
  }

  const onTurnOff = () => {
    peerVideoConnection.turnOffVideoCall();
    setTurnOff(true);
  };
  return (
    <>
      <OrganismsMain ref={mainRef}>
        {!turnOff ? (
          <>
            <MoleculesRemoteVideo ref={remoteVideo} autoPlay />
            <MoleculesLocalVideo ref={localVideo} autoPlay muted />
            <MoleculesVideoControls
              isScreenSharing={Boolean(displayMediaStream)}
              onScreenShare={handleScreenSharing}
              isFullScreen={isFullScreen}
              onFullScreen={handleFullScreen}
              isTimerStarted={startTimer}
              onTurnOff={onTurnOff}
            />
          </>
        ) : (
          <div className="Call_Modal">
            <div className="User_Call_Box">
              <h1>Cuộc gọi đã kết thúc</h1>
            </div>
          </div>
        )}
      </OrganismsMain>
      {userCallReject?.id ? (
        <div className="Call_Modal">
          <div className="User_Call_Box">
            <h1>Từ chối cuộc gọi</h1>
            <div className="user_box">
              <div className="avatar_box">
                <img src={userCallReject.avatar} />
              </div>
              <div className="call-user-info">
                <p>
                  <strong>{userCallReject.email}</strong>{' '}
                  {'đã từ chối gọi cho bạn'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      {disable? (
        <div className="Call_Modal">
          <div className="User_Call_Box">
            <h1>Thiết bị không hỗ trợ</h1>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};
