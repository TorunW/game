import React, { useEffect } from 'react';
import { useSockets } from '../context/socket.context';
import {
  sendRandomNumber,
  setTurnIsActive,
  setSelectedNumber,
} from '../features/chatroomMessagesSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';

function ChatroomMessages() {
  const { socket, username } = useSockets();
  const dispatch = useAppDispatch();
  const sendRandomNumberDisplay = useAppSelector(
    (state) => state.chatroomMessages.number
  );
  const chatroomType = useAppSelector((state) => state.rooms.chatroomType);
  console.log(chatroomType);

  useEffect(() => {
    socket.on('randomNumber', (data) => {
      dispatch(sendRandomNumber(data.number));
      //   onReciveNumber(data)
    });

    socket.on('activateYourTurn', (data) => {
      console.log(data);
      console.log(socket.id);
      let val = false;
      if (chatroomType === 'cpu') {
        if (data.user === socket.id && data.state === 'play') val = true;
      } else {
        if (data.user !== socket.id) val = true;
      }
      console.log(val, ' VAL ON ACTIVATE YOUR TURN');
      dispatch(setTurnIsActive(val));
    });
  }, []);

  function onSendNumber(value: number) {
    // setTurnIsActive(false);
    dispatch(setSelectedNumber(value));
    console.log(value);
  }

  //   function onReciveNumber(data: any) {
  //     // console.log(data, ' ON RECIEVE NUMBER ');

  //     let newMessages: {
  //       prevNumber: any;
  //       selectedNumber: any;
  //       user: any;
  //       number: any;
  //       isCorrectResult: any;
  //     }[] = [];

  //     if (gameOverRef.current === false) {
  //       newMessages = [
  //         ...chatroomMessagesRef.current,
  //         {
  //           prevNumber: data.prevNumber,
  //           selectedNumber: data.selectedNumber,
  //           user: data.user,
  //           number: data.number,
  //           isCorrectResult: data.isCorrectResult,
  //         },
  //       ];
  //     } else {
  //       setRandomNumber(null);
  //       setGameIsActive(false);
  //       setWinner('');
  //       setTurnIsActive(false);
  //       setGameOver(false);
  //       setGameOverRef(false);
  //     }

  //     setChatroomMessagesRef(newMessages);
  //     setRandomNumber(parseInt(data.number));
  //     setIsFirstNumber(data.isFirstNumber);
  //     setIsCorrectResult(data.isCorrectResult);

  //     // if correct anser is false then the data.user is loser
  //     if (data.isCorrectResult === false) {
  //       setGameOver(true);
  //       setGameOverRef(true);
  //       setWinner(data.user !== username ? username : '');
  //     }
  //   }

  // let chatroomMessagesDisplay = chatroomMessages.map((m) => {
  //   return (
  //     <div>
  //       <ul>
  //         {m.user}
  //         {m.prevNumber ? (
  //           <ul>
  //             <li>{m.selectedNumber}</li>
  //             <li>
  //               [{m.selectedNumber}+{m.prevNumber}/3] = {m.number}
  //             </li>
  //           </ul>
  //         ) : (
  //           ''
  //         )}
  //         <li>{m.number}</li>
  //       </ul>
  //     </div>
  //   );
  // });

  let chatDisplay = (
    <div>
      {/* <hr />
          {chatroomMessagesDisplay}
          <hr /> */}
      <p>{sendRandomNumberDisplay}</p>
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
