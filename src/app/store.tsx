import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from '../features/roomsSlice';
import chatroomReducer from '../features/chatroomSlice';
import chatroomMessagesReducer from '../features/chatroomMessagesSlice';
import usersSlice from '../features/usersSlice';
// ...

export const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    chatroom: chatroomReducer,
    chatroomMessages: chatroomMessagesReducer,
    users: usersSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
