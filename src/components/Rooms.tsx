import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useSockets } from '../context/socket.context';
import usePrevious from './usePrev';
import RoomList from './RoomList';
import ChatRoom from './ChatRoom';

type Room = {
  id: string;
  name: string;
  owner: string;
  type: string;
  usersInRoom?: number;
};

type Message = {
  user: string;
  message: string;
  room: string;
};

type ChatRoomMessage = {
  number: number;
  selectedNumber: number;
  user: string;
  prevNumber: number;
  isCorrectResult: number;
};

// show message state var true and false
// set timeout so when it's true it turns false again after a while
// and message dissapears
export default function Rooms() {
  const { socket, username, room, roomType } = useSockets();
  const [rooms, setRooms] = useState<Room[]>([]);

  const roomsRef = useRef(rooms);
  const setRoomsRef = (data: any) => {
    roomsRef.current = data;
    setRooms(data);
  };

  const [chatRoom, setChatRoom] = useState('');
  const [chatRoomType, setChatRoomType] = useState('');
  const [welcomeMsg, setwelcomeMsg] = useState<Message>();
  const [userJoinedMsg, setUserJoinedMsg] = useState<Message>();
  const [gameReady, setGameReady] = useState(false);
  const [gameIsActive, setGameIsActive] = useState(false);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [isFirstNumber, setIsFirstNumber] = useState(false);
  const [turnIsActive, setTurnIsActive] = useState<boolean>(false);
  // console.log(turnIsActive, ' TURN IS ACTIVE');
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isCorrectResult, setIsCorrectResult] = useState();
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [chatRoomMessages, setChatRoomMessages] = useState<ChatRoomMessage[]>(
    []
  );

  const chatRoomMessagesRef = useRef(chatRoomMessages);
  const setChatRoomMessagesRef = (data: any) => {
    chatRoomMessagesRef.current = data;
    setChatRoomMessages(data);
  };

  const gameOverRef = useRef<boolean>(gameOver);
  const setGameOverRef = (data: any) => {
    gameOverRef.current = data;
    setGameOver(data);
  };

  useEffect(() => {
    if (chatRoom) {
      socket.on('message', (data) => {
        setwelcomeMsg(data);
      });
    }
    // not really necesary in this case but just to be sure
    if (chatRoom && chatRoomType !== 'cpu') {
      socket.on('joinedRoomMessage', (data) => {
        setUserJoinedMsg(data);
      });
    }

    if (chatRoom) {
      socket.on('onReady', (data) => {
        setGameReady(data.state);
      });
    }
  }, [chatRoom]);

  useEffect(() => {
    if (gameReady === true) {
      socket.on('randomNumber', (data) => {
        onReciveNumber(data);
      });

      socket.on('activateYourTurn', (data) => {
        console.log(data.state);
        let val = false;
        console.log(data.user, socket.id);
        // if (!data.user) val = true;
        if (chatRoomType === 'cpu') {
          if (data.user === socket.id && data.state === 'play') val = true;
        } else {
          if (data.user !== socket.id) val = true;
        }
        console.log(val, ' VAL ON ACTIVATE YOUR TURN');
        setTurnIsActive(val);
      });
    }

    socket.on('gameOver', (data) => {
      // onGameOver(data);
      setGameOver(true);
      setGameOverRef(true);
      setWinner(data.user);
    });
  }, [gameReady]);

  useEffect(() => {
    if (selectedNumber !== null) {
      socket.emit('sendNumber', {
        randomNumber,
        selectedNumber,
      });
      setSelectedNumber(null);
    }
  }, [selectedNumber]);

  function onLetsPlay() {
    socket.emit('letsPlay');
    setGameIsActive(true);
  }

  // console.log(gameOverRef);
  function onReplay() {
    onLetsPlay();
  }

  function onSendNumber(value: number) {
    console.log(value, ' VALUE ON SEND NUMBER');
    setTurnIsActive(false);
    setSelectedNumber(value);
  }

  function onReciveNumber(data: any) {
    console.log(data, ' ON RECIEVE NUMBER ');

    let newMessages: {
      prevNumber: any;
      selectedNumber: any;
      user: any;
      number: any;
      isCorrectResult: any;
    }[] = [];

    if (gameOverRef.current === false) {
      newMessages = [
        ...chatRoomMessagesRef.current,
        {
          prevNumber: data.prevNumber,
          selectedNumber: data.selectedNumber,
          user: data.user,
          number: data.number,
          isCorrectResult: data.isCorrectResult,
        },
      ];
    } else {
      setRandomNumber(null);
      setGameIsActive(false);
      setWinner('');
      setTurnIsActive(false);
      setGameOver(false);
      setGameOverRef(false);
    }

    setChatRoomMessagesRef(newMessages);
    setRandomNumber(parseInt(data.number));
    setIsFirstNumber(data.isFirstNumber);
    setIsCorrectResult(data.isCorrectResult);

    // if correct anser is false then the data.user is loser
    if (data.isCorrectResult === false) {
      setGameOver(true);
      setGameOverRef(true);
      setWinner(data.user !== username ? username : '');
    }
  }

  // after letplay is clicked it shouldnt be visible

  let letsPlayButtonDisplay;
  if (gameIsActive === false && randomNumber === null) {
    letsPlayButtonDisplay = (
      <button onClick={() => onLetsPlay()}>Let's Play</button>
    );
  }

  let replayButton;
  if (gameOver === true) {
    replayButton = (
      <div>
        {winner === username ? <p>YOU WON!</p> : <p>YOU LOST!</p>}

        <button onClick={() => onReplay()}>Play again?</button>
      </div>
    );
  }
  let chatRoomMessagesDisplay = chatRoomMessages.map((m) => {
    return (
      <div>
        <ul>
          {m.user}
          {m.prevNumber ? (
            <ul>
              <li>{m.selectedNumber}</li>
              <li>
                [{m.selectedNumber}+{m.prevNumber}/3] = {m.number}
              </li>
            </ul>
          ) : (
            ''
          )}
          <li>{m.number}</li>
        </ul>
      </div>
    );
  });

  let chatRoomDisplay;
  if (chatRoom) {
    chatRoomDisplay = (
      <div>
        <p>{welcomeMsg ? welcomeMsg.message : ''}</p>
        <p>
          {userJoinedMsg
            ? `${userJoinedMsg?.user} ${userJoinedMsg?.message}`
            : ''}
        </p>
        <hr />
        {chatRoomMessagesDisplay}
        <hr />
        <p>{randomNumber ? randomNumber : ''}</p>
        {letsPlayButtonDisplay}
        {turnIsActive === true && gameOver === false ? (
          <div>
            <button onClick={() => onSendNumber(-1)} value='-1'>
              -1
            </button>
            <button onClick={() => onSendNumber(0)} value='0'>
              0
            </button>
            <button onClick={() => onSendNumber(+1)} value='+1'>
              +1
            </button>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }

  return (
    <div>
      <p>Rooms</p>
      <RoomList />
      <hr />
      <ChatRoom />
      {chatRoomDisplay}
      {replayButton}
    </div>
  );
}

// split into login, chatroom, messages