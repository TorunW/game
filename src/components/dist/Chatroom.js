"use strict";
exports.__esModule = true;
var react_1 = require("react");
var hooks_1 = require("../app/hooks");
var socket_context_1 = require("../context/socket.context");
var chatroomMessagesSlice_1 = require("../features/chatroomMessagesSlice");
var chatroomSlice_1 = require("../features/chatroomSlice");
require("../styles/chatroom.css");
function Chatroom() {
    var socket = socket_context_1.useSockets().socket;
    var dispatch = hooks_1.useAppDispatch();
    var welocmeMessageDisplay = hooks_1.useAppSelector(function (state) { return state.chatroom.message; });
    var userJoinedMessageDisplay = hooks_1.useAppSelector(function (state) { return state.chatroom.user; });
    var gameIsReady = hooks_1.useAppSelector(function (state) { return state.chatroom.state; });
    var gameIsActive = hooks_1.useAppSelector(function (state) { return state.chatroom.gameIsActive; });
    var gameOver = hooks_1.useAppSelector(function (state) { return state.chatroomMessages.gameOver; });
    var username = hooks_1.useAppSelector(function (state) { return state.users.username; });
    console.log(username, 'usernamechat');
    react_1.useEffect(function () {
        socket.on('message', function (data) {
            dispatch(chatroomSlice_1.welcomeMessage(data.message));
            console.log(data.user === username ? 'ok' : 'näe');
        });
        socket.on('joinedRoomMessage', function (data) {
            dispatch(chatroomSlice_1.userJoinedMessage([data.user, data.message]));
        });
        socket.on('onReady', function (data) {
            dispatch(chatroomSlice_1.ready(data.state));
        });
    }, []);
    function onLetsPlay() {
        socket.emit('letsPlay');
    }
    function onReplay() {
        onLetsPlay();
        dispatch(chatroomMessagesSlice_1.clearChat());
    }
    var startGameButtonDisplay;
    if (gameIsActive === false && gameIsReady === true) {
        startGameButtonDisplay = (react_1["default"].createElement("button", { onClick: function () { return onLetsPlay(); } }, "Let's Play"));
    }
    else if (gameOver === true) {
        startGameButtonDisplay = (react_1["default"].createElement("button", { onClick: function () { return onReplay(); } }, "Play again"));
    }
    return (react_1["default"].createElement("div", { className: 'chatroom' },
        react_1["default"].createElement("p", null, welocmeMessageDisplay),
        react_1["default"].createElement("p", null, userJoinedMessageDisplay),
        startGameButtonDisplay));
}
exports["default"] = Chatroom;
