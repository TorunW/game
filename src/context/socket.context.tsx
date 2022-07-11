import { useContext, useState } from 'react';
import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';
// how would it be in another way?
import { SOCKET_URL } from '../config/default';

interface Context {
  socket: Socket;
  // we want username to not be optional rigt?
}

const socket = io(SOCKET_URL);

const SocketContext = createContext<Context>({
  socket,
});

function SocketsProvider(props: any) {
  return <SocketContext.Provider value={{ socket }} {...props} />;
}

export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;
