"use strict";
exports.__esModule = true;
var react_1 = require("react");
var socket_context_1 = require("./context/socket.context");
var Rooms_1 = require("./components/Rooms");
var Login_1 = require("../src/components/Login");
var hooks_1 = require("../src/app/hooks");
// type Message = {
//   username: string;
//   message: string;
//   room: string;
// };
function App() {
    var dispatch = hooks_1.useAppDispatch();
    var socket = socket_context_1.useSockets().socket;
    var username = hooks_1.useAppSelector(function (state) { return state.users.username; });
    socket.on('listTrigger', function (data) {
        console.log(data, 'listtriger');
    });
    // put login in a component
    return react_1["default"].createElement("div", { className: 'App' }, !username ? react_1["default"].createElement(Login_1["default"], null) : react_1["default"].createElement(Rooms_1["default"], null));
}
exports["default"] = App;
