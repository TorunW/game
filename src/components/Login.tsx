import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login } from '../features/usersSlice';
import { useSockets } from '../context/socket.context';

function Login() {
  const dispatch = useAppDispatch();
  const { socket } = useSockets();
  const [name, setName] = useState('');
  const username = useAppSelector((state) => state.users.username);

  function handleSetUsername(e: any) {
    e.preventDefault();
    dispatch(login({ username: name }));
    socket.emit('login', { username: name });
  }

  return (
    <div>
      {!username && (
        <div>
          <input
            type='text'
            placeholder='Username'
            onChange={(e) => setName(e.target.value)}
          />
          <button className='cta' onClick={handleSetUsername}>
            LOGIN
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;
