import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatroomState {
  user: string;
  message: string;
  room: object;
  state: boolean;
}

const initialState: ChatroomState = {
  user: '',
  message: '',
  room: {},
  state: false,
};

export const chatroomSlice = createSlice({
  name: 'chatroom',
  initialState,
  reducers: {
    welcomeMessage: (state, action) => {
      state.message = action.payload;
    },
    userJoinedMessage: (state, action) => {
      state.message = action.payload;
    },
    ready: (state, action) => {
      state.state = action.payload;
    },
  },
});

export const { welcomeMessage, userJoinedMessage, ready } =
  chatroomSlice.actions;

export default chatroomSlice.reducer;
