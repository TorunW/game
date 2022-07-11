import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import config from 'config';
import APIService from './api.service';

// socketIO cannot be used with the new socket.io update
const port = config.get<number>('port');
const host = config.get<string>('host');
const corsOrigin = config.get<string>('corsOrigin');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});
const apiService = new APIService();
// root domain
// it's a express request, we only use res so we put _ for req
// when server is listening, at localhost:3001 server is up should be shown
app.get('/', (_, res) => res.send('server is up'));

// make our server listen, if youre going to deploy wit docker set the host to 0.00
httpServer.listen(port, host, () => {
  console.log('server is running at localhost:3001');
});

// when a user logges in its created in the database, use socket id as user id
// when the user asks join to a room it wont be possible if full, if its 2 users inside
// when a player is joining a room the room id gets added to the user
// when player is discconecting we delete the user
//  if type is cpu or human, and see how many users are in the room

enum GameState {
  WAIT = 'wait',
  PLAY = 'play',
}

// change all events to be writen with space instrad of camelcase
// updated db is in user, shoudn't it be rooms? and i doesnt get deleted
// catch error in front end
// can we put mapping into redux?
// change resp to result to keep consitency
io.on('connection', (socket) => {
  socket.on('login', ({ username }) => {
    apiService
      .createUser(socket.id, username)
      .then(() => {
        socket.emit('loginMessage', {
          username: username,
          message: `Welcome ${username}`,
          socketId: socket.id,
        });
      })
      .catch((err) => {
        socket.emit('error', { message: err });
      });
  });

  /* Join to the room */
  // changed room to room.name as we don't need to get all the things inside the object
  socket.on('joinRoom', ({ username, room, roomType }) => {
    apiService
      .assignRoom(room.id, socket.id, roomType)
      .then(async () => {
        socket.emit('message', {
          user: username,
          message: `welcome to room ${room.name}`,
          room: room,
        });
        if (roomType !== 'cpu') {
          // broadcast.to didn't work, nothing 'arrived' to the clieant
          socket.broadcast.emit('joinedRoomMessage', {
            user: username,
            message: `has joined ${room.name}`,
            room: room,
          });
        }
        socket.join(room.id);
        const usersInRoom = await io.of('/').in(room.id).fetchSockets();
        io.sockets.emit('updateRoomCount', {
          room: room,
          usersInRoom: usersInRoom.length,
        });
        // usersIn room gives me the previous nr so added plus

        /* Check the room with how many socket is connected */

        /* this seems to be smt that worked in old socket io 
        to fix it I first put the socket.join without the callback
        added the if statment under the socket.join
        nsps adapter etc is also from an old version,
        since that line is supposed to check the room for a list of clients, ie users,
        I have to fin an alternative way to do that.
        room has to be room.id, otherwise a new room got created each time 
        I tried to join a room */

        /* id for Room Izmit CPU and Room Amsterdam had the same ID*/

        const maxRoomSize = roomType === 'cpu' ? 1 : 2;

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
      })
      .catch((err) => {
        socket.emit('error', { message: err });
      });
  });

  /* Start the game and send the first random number with turn control */
  socket.on('letsPlay', () => {
    apiService
      .getUserDetail(socket.id)
      .then((result) => {
        io.to(result?.data.room).emit('randomNumber', {
          number: `${apiService.createRandomNumber(9, 9)}`,
          isFirstNumber: true,
        });

        // like above nsps seems to be from an older
        // Is this to make the lets play player play first? so when
        if (result?.data?.roomType !== 'cpu') {
          socket.broadcast.emit('activateYourTurn', {
            // user: io._nsps.get['/'].adapter.rooms[result?.data.room]
            //   ? Object.keys(
            //       io._nsps.get['/'].adapter.rooms[result?.data.room].sockets
            //     )[0]
            //   : null,
            user: socket.id,
            state: GameState.PLAY,
          });
        } else {
          socket.emit('activateYourTurn', {
            user: socket.id,
            state: GameState.PLAY,
          });
        }
      })
      .catch((err) => {
        socket.emit('error', { message: err });
      });
  });

  /* Send Calculated number back with Divisible control */
  socket.on('sendNumber', ({ randomNumber, selectedNumber }) => {
    apiService.getUserDetail(socket.id).then((result) => {
      const numbers = [selectedNumber, randomNumber];
      const sumValues = (numbers: number[]) => {
        return numbers.reduce((a: number, b: number) => {
          return a + b;
        });
      };

      const calculationResult = (
        numbers: number[],
        randomNumber: number
      ): number => {
        const res = sumValues(numbers);
        if (res % 3 == 0) {
          return res / 3;
        } else {
          return randomNumber;
        }
      };

      const lastResult = calculationResult(numbers, randomNumber);

      const isCorrectResult =
        calculationResult(numbers, randomNumber) == randomNumber ? false : true;

      // When the second oponnent is a CPU
      if (
        result?.data?.roomType === 'cpu' &&
        lastResult !== 1 &&
        isCorrectResult
      ) {
        // After clients selection it will wait 2 seconds for the CPU selection

        setTimeout(() => {
          const setOfRandomNumbers = [-1, 0, 1];

          const randomCPU =
            setOfRandomNumbers[
              Math.floor(Math.random() * setOfRandomNumbers.length)
            ];

          const combinedNumbers = [randomCPU, lastResult];

          const CPUResult = calculationResult(combinedNumbers, lastResult);

          io.to(result?.data.room).emit('randomNumber', {
            number: calculationResult(combinedNumbers, lastResult),
            prevNumber: lastResult,
            isFirstNumber: false,
            user: 'CPU',
            selectedNumber: randomCPU,
            isCorrectResult: CPUResult == lastResult ? false : true,
          });

          io.to(result?.data.room).emit('activateYourTurn', {
            user: socket.id,
            state: GameState.PLAY,
          });

          if (calculationResult(combinedNumbers, lastResult) === 1) {
            io.to(result?.data.room).emit('gameOver', {
              user: 'CPU',
              isOver: true,
            });
          }
        }, 2000);
      }

      io.to(result?.data.room).emit('randomNumber', {
        number: calculationResult(numbers, randomNumber),
        prevNumber: randomNumber,
        isFirstNumber: false,
        user: result?.data.name,
        selectedNumber: selectedNumber,
        isCorrectResult,
      });

      io.to(result?.data.room).emit('activateYourTurn', {
        user: socket.id,
        state: GameState.WAIT,
      });

      /* if 1 is reached than emit the GameOver Listener */
      if (calculationResult(numbers, randomNumber) == 1) {
        io.to(result?.data.room).emit('gameOver', {
          user: result?.data.name,
          isOver: true,
        });
      }
    });
  });

  /* Clear all data and states when the user leave the room */
  socket.on('leaveRoom', (room) => {
    apiService.getUserDetail(socket.id).then((result) => {
      io.to(result?.data.room).emit('onReady', { state: false });
      apiService.removeUserFromRoom(socket.id).then(async () => {
        socket.leave(result?.data.room);
        const usersInRoom = await io
          .of('/')
          .in(result?.data.room)
          .fetchSockets();
        io.sockets.emit('updateRoomCount', {
          room: { id: result?.data.room },
          usersInRoom: usersInRoom.length,
        });
      });
    });
  });

  /* OnDisconnet clear all login and room data from the connected socket */
  socket.on('disconnect', () => {
    apiService.getUserDetail(socket.id).then((result) => {
      socket.broadcast.to(result?.data.room).emit('onReady', { state: false });
      apiService.removeUserFromRoom(socket.id).then(() => {
        socket.leave(result?.data.room);
      });
    });

    // Clear selected user from FakeDb and broadcast the event to the subscribers
    apiService.clearUser(socket.id).then(() => {
      socket.broadcast.emit('listTrigger', `${true}`);
    });
  });
});
