import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useSockets } from '../context/socket.context';
import { welcomeMessage } from '../features/chatRoomSlice';

function ChatRoom() {
  const { socket, username } = useSockets();
  const dispatch = useAppDispatch();
  //   const welcomeMessage = useAppSelector(
  //     (state) => state.rooms.chatRoom.message
  //   );

  useEffect(() => {
    socket.on('message', (data) => {
      console.log(data);
      dispatch(welcomeMessage(data.message));
      //   setwelcomeMsg(data);
    });
  }, []);

  let chatRoomDisplay;
  //   if (chatRoom) {
  chatRoomDisplay = (
    <div>
      {/* <p>{welcomeMessage.message}</p> */}
      {/* <p>
          {userJoinedMsg
            ? `${userJoinedMsg?.user} ${userJoinedMsg?.message}`
            : ''}
        </p>

   */}
    </div>
  );
  //   }
  return <div>{chatRoomDisplay}</div>;
}

export default ChatRoom;
