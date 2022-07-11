import React from 'react';
import { useSockets } from './context/socket.context';
import Rooms from './components/Rooms';
import Login from '../src/components/Login';
import { useAppDispatch, useAppSelector } from '../src/app/hooks';

// type Message = {
//   username: string;
//   message: string;
//   room: string;
// };

function App() {
  const dispatch = useAppDispatch();
  const { socket } = useSockets();
  const username = useAppSelector((state) => state.users.username);

  socket.on('listTrigger', (data) => {
    console.log(data, 'listtriger');
  });

  // put login in a component
  return <div className='App'>{!username ? <Login /> : <Rooms />}</div>;
}

export default App;
