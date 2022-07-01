import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../../app/store'

export type RoomType = {
  id: string;
  name: string;
  owner: string;
  type: string;
  usersInRoom?: number;
};

// Define a type for the slice state
interface RoomState {
  rooms: RoomType[];
  chatRoom: string;
  chatRoomType: string;
  // roomType: string;
  //   value:
}

// Define the initial state using that type
const initialState: RoomState = {
  rooms: [],
  chatRoom: '',
  chatRoomType: '',
};

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    joinRoom: (state, action) => {
      state.chatRoom = action.payload.chatRoom;
      state.chatRoomType = action.payload.chatRoomType;
    },
    leaveRoom: (state) => {
      state.chatRoom = '';
      state.chatRoomType = '';
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
