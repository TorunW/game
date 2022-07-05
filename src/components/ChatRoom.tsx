import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useSockets } from '../context/socket.context';
import {
  welcomeMessage,
  userJoinedMessage,
  ready,
} from '../features/chatroomSlice';

function Chatroom() {
  const { socket } = useSockets();
  const dispatch = useAppDispatch();
  const welocmeMessageDisplay = useAppSelector(
    (state) => state.chatroom.message
  );
  const userJoinedMessageDisplay = useAppSelector(
    (state) => state.chatroom.user
  );
  const readyDisplay = useAppSelector((state) => state.chatroom.state);

  useEffect(() => {
    socket.on('message', (data) => {
      dispatch(welcomeMessage(data.message));
    });
    socket.on('joinedRoomMessage', (data) => {
      dispatch(userJoinedMessage([data.user, data.message]));
    });
    socket.on('onReady', (data) => {
      dispatch(ready(data.state));
    });
  }, []);

  function onLetsPlay() {
    socket.emit('letsPlay');
  }

  return (
    <div>
      <p>{welocmeMessageDisplay}</p>
      <p>{userJoinedMessageDisplay}</p>
      {readyDisplay === true ? (
        <button onClick={() => onLetsPlay()}>Let's Play</button>
      ) : (
        ''
      )}
    </div>
  );
}

export default Chatroom;
