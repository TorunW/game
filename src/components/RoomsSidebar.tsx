import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  setRooms,
  joinRoom,
  RoomType,
  updateRoomCount,
  leaveRoom,
} from '../features/roomsSlice';
import { clearChat, setTurnIsActive } from '../features/chatroomMessagesSlice';
import { setGameIsActive } from '../features/chatroomSlice';
import axios from 'axios';
import { useSockets } from '../context/socket.context';
import { loginMessage } from '../features/usersSlice';
import '../styles/roomsSidebar.css';

function RoomList() {
  const { socket } = useSockets();

  const dispatch = useAppDispatch();
  const rooms = useAppSelector((state) => state.rooms.rooms);
  const chatroom = useAppSelector((state) => state.rooms.chatroom);
  const username = useAppSelector((state) => state.users.username);
  const loginMsg = useAppSelector((state) => state.users.message);

  useEffect(() => {
    getRooms();
    socket.on('updateRoomCount', (data) => {
      dispatch(updateRoomCount(data));
    });

    socket.on('loginMessage', (data) => {
      dispatch(loginMessage(data.message));
    });
  }, []);

  async function getRooms() {
    axios.get('http://localhost:3004/rooms').then((resp) => {
      dispatch(setRooms(resp.data));
    });
  }

  function onJoinRoom(room: RoomType) {
    console.log(room, 'rum');
    socket.emit('joinRoom', {
      username,
      room,
      roomType: room.type,
    });
    dispatch(
      joinRoom({
        chatroom: room.id,
        chatroomType: room.type,
        // username: room.user,
      })
    );
  }

  function onLeaveRoom() {
    socket.emit('leaveRoom', { room: chatroom });
    dispatch(leaveRoom());
    dispatch(clearChat());
    dispatch(setTurnIsActive(false));
    dispatch(setGameIsActive(false));
  }

  // if both aren't logged already and one joins a room the other one doesn't
  // see how many player has oined and which rooms are full
  let roomsNavDisplay;
  if (rooms) {
    roomsNavDisplay = rooms.map((r) => {
      const maxRoomSize = r.type === 'cpu' ? 1 : 2;
      return (
        <div>
          <div
            className='room'
            onClick={
              r.usersInRoom !== maxRoomSize ? () => onJoinRoom(r) : () => void r
            }
          >
            <p className='room-name'>{r.name}</p>
            <svg
              width='32'
              height='32'
              viewBox='0 0 32 32'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M11.715 21.7687L17.5004 15.9996L11.715 10.2304C11.4593 9.97592 11.3333 9.6402 11.3333 9.30447C11.3333 8.97051 11.4593 8.63479 11.715 8.38034C12.2265 7.87322 13.0611 7.87322 13.5707 8.38034L20.283 15.0737C20.5387 15.3299 20.6666 15.6638 20.6666 15.9996C20.6666 16.3353 20.5387 16.671 20.283 16.9237L13.5707 23.617C13.0611 24.1277 12.2265 24.1277 11.715 23.617C11.4593 23.3643 11.3333 23.0286 11.3333 22.6929C11.3333 22.3589 11.4593 22.0232 11.715 21.7687Z'
                fill='#1574F5'
              />
            </svg>
            <div className='vector'></div>
          </div>

          {r.id === chatroom ? (
            <button onClick={() => onLeaveRoom()}>Leave room</button>
          ) : (
            ''
          )}
        </div>
      );
    });
  }

  return (
    <div>
      <div className='sidebar'>
        <p>Choose your game room</p>
        <div className='sidebar-container'>{roomsNavDisplay}</div>
      </div>
      <div>{loginMsg}</div>
    </div>
  );
}

export default RoomList;
