import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useSockets } from '../context/socket.context';
import { clearChat } from '../features/chatroomMessagesSlice';
import {
  welcomeMessage,
  userJoinedMessage,
  ready,
} from '../features/chatroomSlice';
import '../styles/chatroom.css';

function Chatroom() {
  const { socket } = useSockets();
  const dispatch = useAppDispatch();
  const welocmeMessageDisplay = useAppSelector(
    (state) => state.chatroom.message
  );
  const userJoinedMessageDisplay = useAppSelector(
    (state) => state.chatroom.user
  );
  const gameIsReady = useAppSelector((state) => state.chatroom.state);
  const gameIsActive = useAppSelector((state) => state.chatroom.gameIsActive);
  const gameOver = useAppSelector((state) => state.chatroomMessages.gameOver);
  const username = useAppSelector((state) => state.users.username);

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

  function onReplay() {
    onLetsPlay();
    dispatch(clearChat());
  }

  let startGameButtonDisplay;
  if (gameIsActive === false && gameIsReady === true) {
    startGameButtonDisplay = (
      <button onClick={() => onLetsPlay()}>Let's Play</button>
    );
  } else if (gameOver === true) {
    startGameButtonDisplay = (
      <button onClick={() => onReplay()}>Play again</button>
    );
  }
  return (
    <div className='chatroom'>
      <p>{welocmeMessageDisplay}</p>
      <p>{userJoinedMessageDisplay}</p>
      {startGameButtonDisplay}
    </div>
  );
}

export default Chatroom;
