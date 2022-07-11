"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var hooks_1 = require("../app/hooks");
var roomsSlice_1 = require("../features/roomsSlice");
var chatroomMessagesSlice_1 = require("../features/chatroomMessagesSlice");
var chatroomSlice_1 = require("../features/chatroomSlice");
var axios_1 = require("axios");
var socket_context_1 = require("../context/socket.context");
var usersSlice_1 = require("../features/usersSlice");
require("../styles/roomsSidebar.css");
function RoomList() {
    var socket = socket_context_1.useSockets().socket;
    var dispatch = hooks_1.useAppDispatch();
    var rooms = hooks_1.useAppSelector(function (state) { return state.rooms.rooms; });
    var chatroom = hooks_1.useAppSelector(function (state) { return state.rooms.chatroom; });
    var username = hooks_1.useAppSelector(function (state) { return state.users.username; });
    var loginMsg = hooks_1.useAppSelector(function (state) { return state.users.message; });
    react_1.useEffect(function () {
        getRooms();
        socket.on('updateRoomCount', function (data) {
            dispatch(roomsSlice_1.updateRoomCount(data));
        });
        socket.on('loginMessage', function (data) {
            dispatch(usersSlice_1.loginMessage(data.message));
        });
    }, []);
    function getRooms() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                axios_1["default"].get('http://localhost:3004/rooms').then(function (resp) {
                    dispatch(roomsSlice_1.setRooms(resp.data));
                });
                return [2 /*return*/];
            });
        });
    }
    function onJoinRoom(room) {
        console.log(room, 'rum');
        socket.emit('joinRoom', {
            username: username,
            room: room,
            roomType: room.type
        });
        dispatch(roomsSlice_1.joinRoom({
            chatroom: room.id,
            chatroomType: room.type
        }));
    }
    function onLeaveRoom() {
        socket.emit('leaveRoom', { room: chatroom });
        dispatch(roomsSlice_1.leaveRoom());
        dispatch(chatroomMessagesSlice_1.clearChat());
        dispatch(chatroomMessagesSlice_1.setTurnIsActive(false));
        dispatch(chatroomSlice_1.setGameIsActive(false));
    }
    // if both aren't logged already and one joins a room the other one doesn't
    // see how many player has oined and which rooms are full
    var roomsNavDisplay;
    if (rooms) {
        roomsNavDisplay = rooms.map(function (r) {
            var maxRoomSize = r.type === 'cpu' ? 1 : 2;
            return (react_1["default"].createElement("div", null,
                react_1["default"].createElement("div", { className: 'room', onClick: r.usersInRoom !== maxRoomSize ? function () { return onJoinRoom(r); } : function () { return void r; } },
                    react_1["default"].createElement("p", { className: 'room-name' }, r.name),
                    react_1["default"].createElement("svg", { width: '32', height: '32', viewBox: '0 0 32 32', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
                        react_1["default"].createElement("path", { "fill-rule": 'evenodd', "clip-rule": 'evenodd', d: 'M11.715 21.7687L17.5004 15.9996L11.715 10.2304C11.4593 9.97592 11.3333 9.6402 11.3333 9.30447C11.3333 8.97051 11.4593 8.63479 11.715 8.38034C12.2265 7.87322 13.0611 7.87322 13.5707 8.38034L20.283 15.0737C20.5387 15.3299 20.6666 15.6638 20.6666 15.9996C20.6666 16.3353 20.5387 16.671 20.283 16.9237L13.5707 23.617C13.0611 24.1277 12.2265 24.1277 11.715 23.617C11.4593 23.3643 11.3333 23.0286 11.3333 22.6929C11.3333 22.3589 11.4593 22.0232 11.715 21.7687Z', fill: '#1574F5' })),
                    react_1["default"].createElement("div", { className: 'vector' })),
                r.id === chatroom ? (react_1["default"].createElement("button", { onClick: function () { return onLeaveRoom(); } }, "Leave room")) : ('')));
        });
    }
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("div", { className: 'sidebar' },
            react_1["default"].createElement("p", null, "Choose your game room"),
            react_1["default"].createElement("div", { className: 'sidebar-container' }, roomsNavDisplay)),
        react_1["default"].createElement("div", null, loginMsg)));
}
exports["default"] = RoomList;
