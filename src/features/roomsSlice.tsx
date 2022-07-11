import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../../app/store'

export type RoomType = {
  uid: any;
  id: string;
  name: string;
  owner: string;
  type: string;
  usersInRoom?: number;
  user: string;
};

// Define a type for the slice state
interface RoomState {
  rooms: RoomType[];
  chatroom: string;
  chatroomType: string;
  userId: string;
}

// Define the initial state using that type
const initialState: RoomState = {
  rooms: [],
  chatroom: '',
  chatroomType: '',
  userId: '',
};

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    joinRoom: (state, action) => {
      state.chatroom = action.payload.chatroom;
      state.chatroomType = action.payload.chatroomType;
    },
    leaveRoom: (state) => {
      state.chatroom = '';
      state.chatroomType = '';
    },
    setRooms: (state, action: PayloadAction<RoomType[]>) => {
      state.rooms = action.payload;
    },
    updateRoomCount: (state, action) => {
      const roomIndex = state.rooms.findIndex(
        (room) => room.id === action.payload.room.id
      );
      state.rooms[roomIndex].usersInRoom = action.payload.usersInRoom;
    },
  },
});

export const { joinRoom, leaveRoom, setRooms, updateRoomCount } =
  roomsSlice.actions;

export default roomsSlice.reducer;
