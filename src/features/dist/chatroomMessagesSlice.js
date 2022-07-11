"use strict";
var _a;
exports.__esModule = true;
exports.clearChat = exports.setGameOver = exports.addMessage = exports.setSelectedNumber = exports.setTurnIsActive = exports.sendFirstNumber = exports.chatroomMessagesSlice = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
// Define the initial state using that type
var initialState = {
    messages: [],
    selectedNumber: undefined,
    turnIsActive: false,
    isFirstNumber: false,
    gameOver: false,
    isWinner: false
};
exports.chatroomMessagesSlice = toolkit_1.createSlice({
    name: 'chatroomMessages',
    initialState: initialState,
    reducers: {
        sendFirstNumber: function (state, action) {
            state.isFirstNumber = action.payload;
        },
        setTurnIsActive: function (state, action) {
            state.turnIsActive = action.payload;
        },
        setSelectedNumber: function (state, action) {
            state.selectedNumber = action.payload;
        },
        addMessage: function (state, action) {
            if (action.payload.isCorrectResult !== false) {
                var duplicatedMessageIndex = state.messages.findIndex(function (msg) { return msg.number === action.payload.number; });
                if (duplicatedMessageIndex === -1)
                    state.messages.push(action.payload);
                state.gameOver = false;
            }
            else if (action.payload.isCorrectResult === false) {
                console.log('hello');
                state.gameOver = true;
                if (action.payload.user !== action.payload.currentUser) {
                    state.isWinner = true;
                    console.log('iam winner');
                }
                else {
                    state.isWinner = false;
                    console.log('iam loser');
                }
            }
        },
        setGameOver: function (state, action) {
            state.gameOver = true;
            if (action.payload.user === action.payload.currentUser) {
                state.isWinner = true;
            }
            else {
                state.isWinner = false;
            }
            state.turnIsActive = false;
        },
        clearChat: function (state) {
            state.messages = [];
            state.gameOver = false;
        }
    }
});
// state is what we change
// and action payload holds the most current value so we use that for if else
//
exports.sendFirstNumber = (_a = exports.chatroomMessagesSlice.actions, _a.sendFirstNumber), exports.setTurnIsActive = _a.setTurnIsActive, exports.setSelectedNumber = _a.setSelectedNumber, exports.addMessage = _a.addMessage, exports.setGameOver = _a.setGameOver, exports.clearChat = _a.clearChat;
exports["default"] = exports.chatroomMessagesSlice.reducer;
