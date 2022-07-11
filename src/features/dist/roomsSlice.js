"use strict";
var _a;
exports.__esModule = true;
exports.updateRoomCount = exports.setRooms = exports.leaveRoom = exports.joinRoom = exports.roomsSlice = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
// Define the initial state using that type
var initialState = {
    rooms: [],
    chatroom: '',
    chatroomType: '',
    userId: ''
};
exports.roomsSlice = toolkit_1.createSlice({
    name: 'rooms',
    initialState: initialState,
    reducers: {
        joinRoom: function (state, action) {
            state.chatroom = action.payload.chatroom;
            state.chatroomType = action.payload.chatroomType;
        },
        leaveRoom: function (state) {
            state.chatroom = '';
            state.chatroomType = '';
        },
        setRooms: function (state, action) {
            state.rooms = action.payload;
        },
        updateRoomCount: function (state, action) {
            var roomIndex = state.rooms.findIndex(function (room) { return room.id === action.payload.room.id; });
            state.rooms[roomIndex].usersInRoom = action.payload.usersInRoom;
        }
    }
});
exports.joinRoom = (_a = exports.roomsSlice.actions, _a.joinRoom), exports.leaveRoom = _a.leaveRoom, exports.setRooms = _a.setRooms, exports.updateRoomCount = _a.updateRoomCount;
exports["default"] = exports.roomsSlice.reducer;
