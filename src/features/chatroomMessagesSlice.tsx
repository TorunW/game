import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ChatroomMessagesType = {
  number?: number;
  selectedNumber: number | undefined;
  user: string;
  prevNumber: number | undefined;
  isCorrectResult: number | undefined;
};

// Define a type for the slice state
interface ChatroomMessagesState {
  messages: ChatroomMessagesType[];
  selectedNumber?: number;
  turn: boolean;
  isFirstNumber?: boolean;
}

// Define the initial state using that type
const initialState: ChatroomMessagesState = {
  messages: [],
  selectedNumber: undefined,
  turn: false,
  isFirstNumber: false,
};

export const chatroomMessagesSlice = createSlice({
  name: 'chatroomMessages',
  initialState,
  reducers: {
    sendFirstNumber: (state, action) => {
      state.isFirstNumber = action.payload;
    },
    setTurnIsActive: (state, action) => {
      state.turn = action.payload;
    },
    setSelectedNumber: (state, action) => {
      state.selectedNumber = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      console.log(action.payload, 'payload');
    },
  },
});

export const {
  sendFirstNumber,
  setTurnIsActive,
  setSelectedNumber,
  addMessage,
} = chatroomMessagesSlice.actions;

export default chatroomMessagesSlice.reducer;
