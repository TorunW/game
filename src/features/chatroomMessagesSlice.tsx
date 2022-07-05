import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
interface ChatroomMessagesState {
  number: number | undefined;
  selectedNumber: number | undefined;
  user: string;
  prevNumber: number | undefined;
  isCorrectResult: number | undefined;
}

// Define the initial state using that type
const initialState: ChatroomMessagesState = {
  number: undefined,
  selectedNumber: undefined,
  user: '',
  prevNumber: undefined,
  isCorrectResult: undefined,
};

export const chatroomMessagesSlice = createSlice({
  name: 'chatroomMessages',
  initialState,
  reducers: {
    sendRandomNumber: (state, action) => {
      state.number = action.payload;
    },
    setTurnIsActive: (state, action) => {
      state.user = action.payload;
    },
    setSelectedNumber: (state, action) => {
      state.selectedNumber = action.payload;
      console.log(action.payload, 'payload');
    },
  },
});

export const { sendRandomNumber, setTurnIsActive, setSelectedNumber } =
  chatroomMessagesSlice.actions;

export default chatroomMessagesSlice.reducer;
