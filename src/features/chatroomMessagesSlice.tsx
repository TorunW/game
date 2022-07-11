import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ChatroomMessagesType = {
  number?: number;
  selectedNumber?: number;
  user: string;
  prevNumber?: number;
  isCorrectResult?: number;
  currentUser?: string;
};

// Define a type for the slice state
interface ChatroomMessagesState {
  messages: ChatroomMessagesType[];
  selectedNumber?: number;
  turnIsActive: boolean;
  isFirstNumber?: boolean;
  gameOver: boolean;
  isWinner: boolean;
}

// Define the initial state using that type
const initialState: ChatroomMessagesState = {
  messages: [],
  selectedNumber: undefined,
  turnIsActive: false,
  isFirstNumber: false,
  gameOver: false,
  isWinner: false,
};

export const chatroomMessagesSlice = createSlice({
  name: 'chatroomMessages',
  initialState,
  reducers: {
    sendFirstNumber: (state, action) => {
      state.isFirstNumber = action.payload;
    },

    setTurnIsActive: (state, action) => {
      state.turnIsActive = action.payload;
    },
    setSelectedNumber: (state, action) => {
      state.selectedNumber = action.payload;
    },
    addMessage: (state, action) => {
      if (action.payload.isCorrectResult !== false) {
        const duplicatedMessageIndex = state.messages.findIndex(
          (msg) => msg.number === action.payload.number
        );
        if (duplicatedMessageIndex === -1) state.messages.push(action.payload);
        state.gameOver = false;
      } else if (action.payload.isCorrectResult === false) {
        console.log('hello');
        state.gameOver = true;
        if (action.payload.user !== action.payload.currentUser) {
          state.isWinner = true;
          console.log('iam winner');
        } else {
          state.isWinner = false;
          console.log('iam loser');
        }
      }
    },
    setGameOver: (state, action) => {
      state.gameOver = true;
      if (action.payload.user === action.payload.currentUser) {
        state.isWinner = true;
      } else {
        state.isWinner = false;
      }
      state.turnIsActive = false;
    },
    clearChat: (state) => {
      state.messages = [];
      state.gameOver = false;
    },
  },
});

// state is what we change
// and action payload holds the most current value so we use that for if else
//

export const {
  sendFirstNumber,
  setTurnIsActive,
  setSelectedNumber,
  addMessage,
  setGameOver,
  clearChat,
} = chatroomMessagesSlice.actions;

export default chatroomMessagesSlice.reducer;
