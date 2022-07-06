import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ChatroomMessagesType = {
  number: number | undefined;
  selectedNumber: number | undefined;
  user: string;
  prevNumber: number | undefined;
  isCorrectResult: number | undefined;
};

// Define a type for the slice state
interface ChatroomMessagesState {
  messages: ChatroomMessagesType[];
}

// Define the initial state using that type
const initialState: ChatroomMessagesState = {
  messages: [],
};

export const chatroomMessagesSlice = createSlice({
  name: 'chatroomMessages',
  initialState,
  reducers: {
    sendRandomNumber: (state, action) => {
      state.messages = action.payload;
    },
    setTurnIsActive: (state, action) => {
      state.messages = action.payload;
    },
    setSelectedNumber: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      console.log(action.payload, 'payload');
    },
  },
});

export const {
  sendRandomNumber,
  setTurnIsActive,
  setSelectedNumber,
  addMessage,
} = chatroomMessagesSlice.actions;

export default chatroomMessagesSlice.reducer;
