import React from 'react';
import './App.css';
import { useSockets } from './context/socket.context';
import Rooms from './components/Rooms';
import { useRef } from 'react';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

type Message = {
  username: string;
  message: string;
  room: string;
};

function App() {
  const { socket, username, setUsername } = useSockets();
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const [loginMsg, setLoginMsg] = useState<Message>();

  useEffect(() => {
    if (username) {
      socket.on('loginMessage', (data) => {
        setLoginMsg(data);
      });
    }
  }, [username]);

  function handleSetUsername() {
    // https://stackoverflow.com/questions/70732921/how-to-apply-useref-in-react-ts
    const value = usernameRef.current?.value;
    if (!value) {
      return;
    }
    setUsername(value);
    socket.emit('login', { username: value });
  }

  socket.on('listTrigger', (data) => {
    console.log(data, 'listtriger');
  });

  // put login in a component
  return (
    <div className='App'>
      {!username && (
        <div>
          <input placeholder='Username' ref={usernameRef} />
          <button className='cta' onClick={handleSetUsername}>
            LOGIN
          </button>
        </div>
      )}
      {username && (
        <div>
          <p>{loginMsg ? loginMsg.message : ''}</p>
          <Rooms />
        </div>
      )}
    </div>
  );
}

export default App;
