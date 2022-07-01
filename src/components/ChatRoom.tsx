import React, { useEffect } from 'react';
import { useSockets } from '../context/socket.context';

function ChatRoom() {
  const { socket, username } = useSockets();

  useEffect(() => {
    socket.on('message', (data) => {
      console.log(data);
      //   setwelcomeMsg(data);
    });
  }, []);
  let chatRoomDisplay;
  //   if (chatRoom) {
  chatRoomDisplay = (
    <div>
      {/* <p>{welcomeMsg ? welcomeMsg.message : ''}</p> */}
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
