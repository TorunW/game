import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../../app/store'

// Define a type for the slice state
interface UserState {
  username: string;
  message: string;
}

// Define the initial state using that type
const initialState: UserState = {
  username: '',
  message: '',
};

export const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.username = action.payload.username;
    },
    loginMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { login, loginMessage } = usersSlice.actions;

export default usersSlice.reducer;
