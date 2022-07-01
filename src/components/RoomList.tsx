import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  setRooms,
  joinRoom,
  RoomType,
  updateRoomCount,
  leaveRoom,
} from '../features/roomsSlice';
import axios from 'axios';
import { useSockets } from '../context/socket.context';

function RoomList() {
  const { socket, username } = useSockets();

  const dispatch = useAppDispatch();
  const rooms = useAppSelector((state) => state.rooms.rooms);
  const chatRoom = useAppSelector((state) => state.rooms.chatRoom);

  useEffect(() => {
    getRooms();
    socket.on('updateRoomCount', (data) => {
      dispatch(updateRoomCount(data));
    });
  }, []);

  async function getRooms() {
    axios.get('http://localhost:3004/rooms').then((resp) => {
      //   setRoomsRef(resp.data);
      dispatch(setRooms(resp.data));
    });
  }

  function onJoinRoom(room: RoomType) {
    socket.emit('joinRoom', {
      username,
      room,
      roomType: room.type,
    });
    dispatch(joinRoom({ chatRoom: room.id, chatRoomType: room.type }));
  }

  function onLeaveRoom() {
    socket.emit('leaveRoom', { room: chatRoom });
    dispatch(leaveRoom());
    // setChatRoom('');
    // setChatRoomType('');
  }

  let roomsNavDisplay;
  if (rooms) {
    roomsNavDisplay = rooms.map((r) => {
      const maxRoomSize = r.type === 'cpu' ? 1 : 2;
      return (
        <ul>
          <li>{r.name}</li>
          <li> {r.usersInRoom}</li>
          {r.usersInRoom !== maxRoomSize ? (
            <button onClick={() => onJoinRoom(r)}>CHOOSe ROOM</button>
          ) : (
            <button>room full</button>
          )}
          <button onClick={() => onLeaveRoom()}>Leave room</button>
        </ul>
      );
    });
  }

  return <div>{roomsNavDisplay}</div>;
}

export default RoomList;
