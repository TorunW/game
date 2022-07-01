import { useContext, useState } from 'react';
import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';
// how would it be in another way?
import { SOCKET_URL } from '../config/default';

interface Context {
  socket: Socket;
  // we want username to not be optional rigt?
  username: string;
  setUsername: Function;
  room: object;
  roomType: string;
  message: string;
}

const socket = io(SOCKET_URL);

const SocketContext = createContext<Context>({
  socket,
  username: '',
  setUsername: () => false,
  room: Object,
  roomType: '',
  message: '',
});

function SocketsProvider(props: any) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState({});
  const [roomType, setRoomType] = useState('');
  const [message, setMessage] = useState('');

  return (
    <SocketContext.Provider
      value={{ socket, username, setUsername, room, roomType, message }}
      {...props}
    />
  );
}

export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;
