import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from '../features/roomsSlice';
import chatRoomReducer from '../features/chatRoomSlice';
// ...

export const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    chatroom: chatRoomReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
