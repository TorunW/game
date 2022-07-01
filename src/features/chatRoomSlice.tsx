import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../../app/store'

// export type ChatRoomType = {
//   user: string;
//   message: string;
// };

// Define a type for the slice state
interface ChatRoomState {
  user: string;
  message: string;
}

// Define the initial state using that type
const initialState: ChatRoomState = {
  user: '',
  message: '',
};

export const chatRoomSlice = createSlice({
  name: 'chatRoom',
  initialState,
  reducers: {
    welcomeMessage: (state, action) => {
      state.message = action.payload.message;
    },
    //     userJoinedMessage: (state) => {
    //     },
    //     letsPlay: (state, action: PayloadAction<RoomType[]>) => {
    //     },
    //     updateRoomCount: (state, action) => {
    //     //   const roomIndex = state.rooms.findIndex(
    //     //     (room) => room.id === action.payload.room.id
    //     //   );

    //     //   state.rooms[roomIndex].usersInRoom = action.payload.usersInRoom;
    //     // },
  },
});

export const { welcomeMessage } = chatRoomSlice.actions;

export default chatRoomSlice.reducer;
