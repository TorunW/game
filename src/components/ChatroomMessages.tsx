import React, { useEffect, useRef } from 'react';
import { useSockets } from '../context/socket.context';
import {
  sendFirstNumber,
  setTurnIsActive,
  setSelectedNumber,
  addMessage,
} from '../features/chatroomMessagesSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { disconnect } from 'process';
import { displayPartsToString } from 'typescript';

function ChatroomMessages() {
  const { socket, username } = useSockets();
  const dispatch = useAppDispatch();
  const chatroomType = useAppSelector((state) => state.rooms.chatroomType);
  const messages = useAppSelector((state) => state.chatroomMessages.messages);
  const activeTurn = useAppSelector((state) => state.chatroomMessages.turn);
  const gameOver = useAppSelector((state) => state.chatroomMessages.gameOver);
  console.log(gameOver, 'game client');

  useEffect(() => {
    socket.on('randomNumber', (data) => {
      dispatch(sendFirstNumber(data.isFirstNumber));
      dispatch(
        addMessage({
          prevNumber: data.number,
          selectedNumber: data.selectedNumber,
          user: data.user,
          number: data.number,
          isCorrectResult: data.isCorrectResult,
        })
      );
    });
  }, []);

  useEffect(() => {
    if (chatroomType) {
      socket.on('activateYourTurn', (data) => {
        let val = false;
        if (chatroomType === 'cpu') {
          if (data.user === socket.id && data.state === 'play') val = true;
        } else {
          if (data.user !== socket.id) val = true;
        }
        dispatch(setTurnIsActive(val));
      });
    }
  }, [chatroomType]);

  function onSendNumber(value: number) {
    // setTurnIsActive(false);
    dispatch(setSelectedNumber(value));

    const lastMessage = messages[messages.length - 1];
    socket.emit('sendNumber', {
      randomNumber: lastMessage.number,
      selectedNumber: value,
    });
  }

  // function onReciveNumber(data: any) {
  //   // console.log(data, ' ON RECIEVE NUMBER ');

  //   // if (gameOverRef.current === false) {
  //   //   newMessages = [
  //   //     ...chatroomMessagesRef.current,
  //   //     {
  //   //       prevNumber: data.prevNumber,
  //   //       selectedNumber: data.selectedNumber,
  //   //       user: data.user,
  //   //       number: data.number,
  //   //       isCorrectResult: data.isCorrectResult,
  //   //     },
  //   //   ];
  //   // } else {
  //   //   setRandomNumber(null);
  //   //   setGameIsActive(false);
  //   //   setWinner('');
  //   //   setTurnIsActive(false);
  //   //   setGameOver(false);
  //   //   setGameOverRef(false);
  //   // }

  //   setChatroomMessagesRef(newMessages);
  //   setRandomNumber(parseInt(data.number));
  //   setIsFirstNumber(data.isFirstNumber);
  //   setIsCorrectResult(data.isCorrectResult);

  //   // if correct anser is false then the data.user is loser
  //   if (data.isCorrectResult === false) {
  //     setGameOver(true);
  //     setGameOverRef(true);
  //     setWinner(data.user !== username ? username : '');
  //   }
  // }

  let chatroomMessagesDisplay = messages.map((m) => {
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

  let chatDisplay = (
    <div>
      <hr />
      {chatroomMessagesDisplay}
      <hr />
      {/* <p>{lastMessage.prevNumber}</p> */}
      {activeTurn === true ? (
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

  return (
    <div>
      messages
      {chatDisplay}
    </div>
  );
}

export default ChatroomMessages;
