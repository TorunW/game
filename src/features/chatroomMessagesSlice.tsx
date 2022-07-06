import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ChatroomMessagesType = {
  number?: number;
  selectedNumber?: number;
  user: string;
  prevNumber?: number;
  isCorrectResult?: number;
};

// Define a type for the slice state
interface ChatroomMessagesState {
  messages: ChatroomMessagesType[];
  selectedNumber?: number;
  turn: boolean;
  isFirstNumber?: boolean;
  gameOver: boolean;
}

// Define the initial state using that type
const initialState: ChatroomMessagesState = {
  messages: [],
  selectedNumber: undefined,
  turn: false,
  isFirstNumber: false,
  gameOver: false,
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
      const duplicateMessage = state.messages.findIndex(
        (msg) => msg.number === action.payload.number
      );
      if (action.payload.isCorrectResult !== false) {
        if (duplicateMessage === -1) state.messages.push(action.payload);
        action.payload.gameOver = false;
      } else if (action.payload.isCorrectResult === false) {
        action.payload.gameOver = true;
      }
      console.log(action.payload.gameOver, 'gameover');
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
