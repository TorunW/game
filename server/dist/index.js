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
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var config_1 = require("config");
var api_service_1 = require("./api.service");
// socketIO cannot be used with the new socket.io update
var port = config_1["default"].get('port');
var host = config_1["default"].get('host');
var corsOrigin = config_1["default"].get('corsOrigin');
var app = express_1["default"]();
var httpServer = http_1.createServer(app);
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: corsOrigin,
        credentials: true
    }
});
var apiService = new api_service_1["default"]();
// root domain
// it's a express request, we only use res so we put _ for req
// when server is listening, at localhost:3001 server is up should be shown
app.get('/', function (_, res) { return res.send('server is up'); });
// make our server listen, if youre going to deploy wit docker set the host to 0.00
httpServer.listen(port, host, function () {
    console.log('server is running at localhost:3001');
});
// when a user logges in its created in the database, use socket id as user id
// when the user asks join to a room it wont be possible if full, if its 2 users inside
// when a player is joining a room the room id gets added to the user
// when player is discconecting we delete the user
//  if type is cpu or human, and see how many users are in the room
var GameState;
(function (GameState) {
    GameState["WAIT"] = "wait";
    GameState["PLAY"] = "play";
})(GameState || (GameState = {}));
// change all events to be writen with space instrad of camelcase
// updated db is in user, shoudn't it be rooms? and i doesnt get deleted
// catch error in front end
// can we put mapping into redux?
// change resp to result to keep consitency
io.on('connection', function (socket) {
    socket.on('login', function (_a) {
        var username = _a.username;
        apiService
            .createUser(socket.id, username)
            .then(function () {
            socket.emit('loginMessage', {
                username: username,
                message: "Welcome " + username,
                socketId: socket.id
            });
        })["catch"](function (err) {
            socket.emit('error', { message: err });
        });
    });
    /* Join to the room */
    // changed room to room.name as we don't need to get all the things inside the object
    socket.on('joinRoom', function (_a) {
        var username = _a.username, room = _a.room, roomType = _a.roomType;
        apiService
            .assignRoom(room.id, socket.id, roomType)
            .then(function () { return __awaiter(void 0, void 0, void 0, function () {
            var usersInRoom, maxRoomSize;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        socket.emit('message', {
                            user: username,
                            message: "welcome to room " + room.name,
                            room: room
                        });
                        if (roomType !== 'cpu') {
                            // broadcast.to didn't work, nothing 'arrived' to the clieant
                            socket.broadcast.emit('joinedRoomMessage', {
                                user: username,
                                message: "has joined " + room.name,
                                room: room
                            });
                        }
                        socket.join(room.id);
                        return [4 /*yield*/, io.of('/')["in"](room.id).fetchSockets()];
                    case 1:
                        usersInRoom = _a.sent();
                        io.sockets.emit('updateRoomCount', {
                            room: room,
                            usersInRoom: usersInRoom.length
                        });
                        maxRoomSize = roomType === 'cpu' ? 1 : 2;
                        // didn't work, seems like a lot of peaople experience the same problem
                        // solution send the state to everyone else in the room and yourself separetly
                        if (usersInRoom && usersInRoom.length === maxRoomSize) {
                            // apiService.getUsersInRoom(room.id).then((result) => {
                            //   const firstPlayerId =
                            //     maxRoomSize === 2
                            //       ? result?.data[Math.floor(Math.random() * 2)].id
                            //       : '';
                            //   io.to(firstPlayerId).emit('isFirstPlayer');
                            // });
                            // cahnge to io.to(room)
                            io.to(room.id).emit('onReady', { state: true });
                            // socket.emit('onReady', { state: true });
                        }
                        return [2 /*return*/];
                }
            });
        }); })["catch"](function (err) {
            socket.emit('error', { message: err });
        });
    });
    /* Start the game and send the first random number with turn control */
    socket.on('letsPlay', function () {
        apiService
            .getUserDetail(socket.id)
            .then(function (result) {
            var _a;
            io.to(result === null || result === void 0 ? void 0 : result.data.room).emit('randomNumber', {
                number: "" + apiService.createRandomNumber(9, 9),
                isFirstNumber: true
            });
            // like above nsps seems to be from an older
            // Is this to make the lets play player play first? so when
            if (((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.roomType) !== 'cpu') {
                socket.broadcast.emit('activateYourTurn', {
                    // user: io._nsps.get['/'].adapter.rooms[result?.data.room]
                    //   ? Object.keys(
                    //       io._nsps.get['/'].adapter.rooms[result?.data.room].sockets
                    //     )[0]
                    //   : null,
                    user: socket.id,
                    state: GameState.PLAY
                });
            }
            else {
                socket.emit('activateYourTurn', {
                    user: socket.id,
                    state: GameState.PLAY
                });
            }
        })["catch"](function (err) {
            socket.emit('error', { message: err });
        });
    });
    /* Send Calculated number back with Divisible control */
    socket.on('sendNumber', function (_a) {
        var randomNumber = _a.randomNumber, selectedNumber = _a.selectedNumber;
        apiService.getUserDetail(socket.id).then(function (result) {
            var _a;
            var numbers = [selectedNumber, randomNumber];
            var sumValues = function (numbers) {
                return numbers.reduce(function (a, b) {
                    return a + b;
                });
            };
            var calculationResult = function (numbers, randomNumber) {
                var res = sumValues(numbers);
                if (res % 3 == 0) {
                    return res / 3;
                }
                else {
                    return randomNumber;
                }
            };
            var lastResult = calculationResult(numbers, randomNumber);
            var isCorrectResult = calculationResult(numbers, randomNumber) == randomNumber ? false : true;
            // When the second oponnent is a CPU
            if (((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.roomType) === 'cpu' &&
                lastResult !== 1 &&
                isCorrectResult) {
                // After clients selection it will wait 2 seconds for the CPU selection
                setTimeout(function () {
                    var setOfRandomNumbers = [-1, 0, 1];
                    var randomCPU = setOfRandomNumbers[Math.floor(Math.random() * setOfRandomNumbers.length)];
                    var combinedNumbers = [randomCPU, lastResult];
                    var CPUResult = calculationResult(combinedNumbers, lastResult);
                    io.to(result === null || result === void 0 ? void 0 : result.data.room).emit('randomNumber', {
                        number: calculationResult(combinedNumbers, lastResult),
                        prevNumber: lastResult,
                        isFirstNumber: false,
                        user: 'CPU',
                        selectedNumber: randomCPU,
                        isCorrectResult: CPUResult == lastResult ? false : true
                    });
                    io.to(result === null || result === void 0 ? void 0 : result.data.room).emit('activateYourTurn', {
                        user: socket.id,
                        state: GameState.PLAY
                    });
                    if (calculationResult(combinedNumbers, lastResult) === 1) {
                        io.to(result === null || result === void 0 ? void 0 : result.data.room).emit('gameOver', {
                            user: 'CPU',
                            isOver: true
                        });
                    }
                }, 2000);
            }
            io.to(result === null || result === void 0 ? void 0 : result.data.room).emit('randomNumber', {
                number: calculationResult(numbers, randomNumber),
                prevNumber: randomNumber,
                isFirstNumber: false,
                user: result === null || result === void 0 ? void 0 : result.data.name,
                selectedNumber: selectedNumber,
                isCorrectResult: isCorrectResult
            });
            io.to(result === null || result === void 0 ? void 0 : result.data.room).emit('activateYourTurn', {
                user: socket.id,
                state: GameState.WAIT
            });
            /* if 1 is reached than emit the GameOver Listener */
            if (calculationResult(numbers, randomNumber) == 1) {
                io.to(result === null || result === void 0 ? void 0 : result.data.room).emit('gameOver', {
                    user: result === null || result === void 0 ? void 0 : result.data.name,
                    isOver: true
                });
            }
        });
    });
    /* Clear all data and states when the user leave the room */
    socket.on('leaveRoom', function (room) {
        apiService.getUserDetail(socket.id).then(function (result) {
            io.to(result === null || result === void 0 ? void 0 : result.data.room).emit('onReady', { state: false });
            apiService.removeUserFromRoom(socket.id).then(function () { return __awaiter(void 0, void 0, void 0, function () {
                var usersInRoom;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            socket.leave(result === null || result === void 0 ? void 0 : result.data.room);
                            return [4 /*yield*/, io
                                    .of('/')["in"](result === null || result === void 0 ? void 0 : result.data.room)
                                    .fetchSockets()];
                        case 1:
                            usersInRoom = _a.sent();
                            io.sockets.emit('updateRoomCount', {
                                room: { id: result === null || result === void 0 ? void 0 : result.data.room },
                                usersInRoom: usersInRoom.length
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    /* OnDisconnet clear all login and room data from the connected socket */
    socket.on('disconnect', function () {
        apiService.getUserDetail(socket.id).then(function (result) {
            socket.broadcast.to(result === null || result === void 0 ? void 0 : result.data.room).emit('onReady', { state: false });
            apiService.removeUserFromRoom(socket.id).then(function () {
                socket.leave(result === null || result === void 0 ? void 0 : result.data.room);
            });
        });
        // Clear selected user from FakeDb and broadcast the event to the subscribers
        apiService.clearUser(socket.id).then(function () {
            socket.broadcast.emit('listTrigger', "" + true);
        });
    });
});
