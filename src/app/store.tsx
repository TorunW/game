import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from '../features/roomsSlice';
import chatroomReducer from '../features/chatroomSlice';
import chatroomMessagesReducer from '../features/chatroomMessagesSlice';
// ...

export const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    chatroom: chatroomReducer,
    chatroomMessages: chatroomMessagesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
