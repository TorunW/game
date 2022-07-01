import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../../app/store'

export type Messages = {
  user: string;
  message: string;
  room: string;
};

// Define a type for the slice state
interface ChatRoomState {
  messages: Messages;
}

// Define the initial state using that type
const initialState: ChatRoomState = {
  messages: {},
};

export const chatRoomSlice = createSlice({
  name: 'chatRoom',
  initialState,
  reducers: {
    welcomeMessage: (state, action) => {
      state.messages = action.payload.message;
      console.log((state.messages = action.payload.message), 'payloadwhatever');
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
