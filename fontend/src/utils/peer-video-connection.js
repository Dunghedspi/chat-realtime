import * as io from 'socket.io-client';

const { RTCPeerConnection, RTCSessionDescription } = window;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class PeerConnectionSession {
  constructor(socket, peerConnection) {
    this.socket = socket;
    this.peerConnection = peerConnection;
    this.isAlreadyCalling = false;

    this.peerConnection.addEventListener('connectionstatechange', event => {
      console.log(this.peerConnection.connectionState);
      const fn = this[
        '_on' + capitalizeFirstLetter(this.peerConnection.connectionState)
      ];
      fn && fn(event);
    });
    this.onCallMade();
  }

  async callUser(room_id) {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(
      new RTCSessionDescription(offer),
    );

    this.socket.emit('make-offer', { offer, room_id });
  }

  onCallMade() {
    this.socket.on('call-made', async data => {
      const { room_id, offer } = data;
      console.log('call-made', room_id, offer);
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer),
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(
        new RTCSessionDescription(answer),
      );

      this.socket.emit('make-answer', {
        answer,
        room_id,
      });
    });
  }

  onAnswerMade(callback) {
    this.socket.on('answer-made', async data => {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer),
      );
      console.log('answer', data.answer);
      if (!this.isAlreadyCalling) {
        callback(data.room_id);
        this.isAlreadyCalling = true;
      }
    });
  }

  onConnected(callback) {
    this._onConnected = callback;
  }

  onDisconnected(callback) {
    this._onDisconnected = callback;
  }

  onCallRejected(callback) {
    this.socket.on('call-rejected', data => {
      callback(data);
    });
  }

  onTrack(callback) {
    this.peerConnection.ontrack = function({ streams: [stream] }) {
      callback(stream);
    };
  }

  callUserBeforeConnect(room_id) {
    this.socket.emit('call-user', { room_id });
  }

  resolveCall(room_id) {
    this.socket.emit('resolve-call', { room_id });
  }

  onResolveCall(callback) {
    this.socket.on('resolve-call', data => {
      const { room_id } = data;
      callback(room_id);
    });
  }

  onRejectCall(callback) {
    this.socket.on('reject-call', data => {
      const { user } = data;
      callback(user);
    });
  }

  turnOffVideoCall() {
    this.peerConnection.close();
  }

  onListenStateChange(callback) {
    this.peerConnection.onconnectionstatechange = () => {
      switch (this.peerConnection.connectionState) {
        case 'disconnected':
          callback();
          break;
      }
    };
  }
}

export const createPeerConnectionContext = () => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });
  const socket = io(process.env.REACT_APP_SERVER_DOMAIN_SOCKET);

  return new PeerConnectionSession(socket, peerConnection);
};
