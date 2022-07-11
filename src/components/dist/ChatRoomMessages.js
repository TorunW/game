"use strict";
exports.__esModule = true;
var react_1 = require("react");
var socket_context_1 = require("../context/socket.context");
var chatroomMessagesSlice_1 = require("../features/chatroomMessagesSlice");
var chatroomSlice_1 = require("../features/chatroomSlice");
var hooks_1 = require("../app/hooks");
require("../styles/chatroomMessages.css");
function ChatroomMessages() {
    var socket = socket_context_1.useSockets().socket;
    var dispatch = hooks_1.useAppDispatch();
    var chatroomType = hooks_1.useAppSelector(function (state) { return state.rooms.chatroomType; });
    var messages = hooks_1.useAppSelector(function (state) { return state.chatroomMessages.messages; });
    var activeTurn = hooks_1.useAppSelector(function (state) { return state.chatroomMessages.turnIsActive; });
    var gameOver = hooks_1.useAppSelector(function (state) { return state.chatroomMessages.gameOver; });
    var isWinner = hooks_1.useAppSelector(function (state) { return state.chatroomMessages.isWinner; });
    var username = hooks_1.useAppSelector(function (state) { return state.users.username; });
    var isFirstNumber = hooks_1.useAppSelector(function (state) { return state.chatroomMessages.isFirstNumber; });
    react_1.useEffect(function () {
        socket.on('randomNumber', function (data) {
            dispatch(chatroomMessagesSlice_1.sendFirstNumber(data.isFirstNumber));
            dispatch(chatroomSlice_1.setGameIsActive(true));
            dispatch(chatroomMessagesSlice_1.addMessage({
                prevNumber: data.prevNumber,
                selectedNumber: data.selectedNumber,
                user: data.user,
                number: data.number,
                isCorrectResult: data.isCorrectResult,
                currentUser: username
            }));
        });
    }, []);
    react_1.useEffect(function () {
        if (chatroomType) {
            socket.on('activateYourTurn', function (data) {
                var val = false;
                if (chatroomType === 'cpu') {
                    if (data.user === socket.id && data.state === 'play')
                        val = true;
                }
                else {
                    if (data.user !== socket.id)
                        val = true;
                }
                dispatch(chatroomMessagesSlice_1.setTurnIsActive(val));
            });
        }
    }, [chatroomType]);
    react_1.useEffect(function () {
        socket.on('gameOver', function (data) {
            console.log(data, 'data');
            dispatch(chatroomMessagesSlice_1.setGameOver({
                user: data.user,
                currentUser: username
            }));
        });
    }, []);
    function onSendNumber(value) {
        dispatch(chatroomMessagesSlice_1.setSelectedNumber(value));
        var lastMessage = messages[messages.length - 1];
        socket.emit('sendNumber', {
            randomNumber: lastMessage.number,
            selectedNumber: value
        });
    }
    var gameOverMessage;
    if (gameOver === true) {
        gameOverMessage = (React.createElement("div", null, isWinner === true ? React.createElement("p", null, "YOU WON!") : React.createElement("p", null, "YOU LOST!")));
    }
    var chatroomMessagesDisplay = messages.map(function (m) {
        console.log(m, 'haha');
        return (React.createElement("div", { className: m.user === m.currentUser ? 'user-messages' : 'opponent-messages' },
            m.user !== 'CPU' && isFirstNumber === false ? (React.createElement("svg", { width: '40', height: '40', viewBox: '0 0 40 40', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
                React.createElement("circle", { cx: '20', cy: '20', r: '20', fill: '#205A6D' }),
                React.createElement("path", { "fill-rule": 'evenodd', "clip-rule": 'evenodd', d: 'M20 20C22.21 20 24 18.21 24 16C24 13.79 22.21 12 20 12C17.79 12 16 13.79 16 16C16 18.21 17.79 20 20 20ZM20 22C17.33 22 12 23.34 12 26V28H28V26C28 23.34 22.67 22 20 22Z', fill: 'white' }))) : m.user === 'CPU' && isFirstNumber === false ? (React.createElement("svg", { width: '40', height: '40', viewBox: '0 0 40 40', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
                React.createElement("path", { d: 'M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z', fill: '#E67300' }),
                React.createElement("path", { d: 'M32.2241 19.6098C32.1445 19.4024 31.0429 17.3684 28.9988 14.8167C28.9467 14.755 28.914 14.6794 28.9047 14.5993C28.7812 13.1127 28.5754 11.6342 28.2883 10.1704C28.2558 10.0235 28.1781 9.89051 28.0661 9.79002C27.9542 9.68953 27.8136 9.6266 27.6641 9.61004L25.5348 9.35341C25.5162 9.35174 25.4974 9.35174 25.4788 9.35341C25.3599 9.35341 25.2459 9.40064 25.1618 9.4847C25.0778 9.56877 25.0305 9.68279 25.0305 9.80167V10.5391C25.0305 10.5462 25.0277 10.553 25.0227 10.5581C25.0176 10.5631 25.0108 10.566 25.0036 10.566C24.997 10.5661 24.9906 10.5637 24.9857 10.5592C23.6582 9.35251 22.2247 8.26781 20.7025 7.31828C20.3912 7.10986 20.0248 6.99904 19.6502 7.00001C19.2756 6.99904 18.9092 7.10986 18.5979 7.31828C11.262 11.8514 7.22535 19.2063 7.06958 19.6098C7.02379 19.7067 7.00003 19.8126 7 19.9198C6.99997 20.027 7.02369 20.1329 7.06943 20.2298C7.11518 20.3268 7.18183 20.4124 7.26459 20.4805C7.34735 20.5487 7.44417 20.5977 7.54811 20.624L9.66057 21.0308C9.80021 21.0691 9.92516 21.1484 10.0193 21.2585C10.1133 21.3686 10.1723 21.5043 10.1884 21.6482C10.2052 22.0214 10.6053 30.3513 11.1062 32.512C11.1475 32.6672 11.2388 32.8044 11.3661 32.9023C11.4934 33.0001 11.6494 33.0532 11.81 33.0533H11.8257C13.0584 33.0219 14.1869 33.0017 15.4118 32.9849H15.5127C15.5754 32.9843 15.6354 32.9591 15.6796 32.9146C15.7239 32.8702 15.7489 32.8101 15.7492 32.7473V32.7417C15.6987 32.0144 15.5923 30.3514 15.506 28.5953C15.506 28.5516 15.5004 28.4966 15.4981 28.4518C15.4924 28.38 15.4694 28.3106 15.4312 28.2496C15.393 28.1885 15.3406 28.1376 15.2785 28.1011C14.9567 27.9091 14.6872 27.6408 14.4938 27.3198C14.3005 26.9988 14.1893 26.6351 14.1701 26.2609C14.0581 23.3405 14.0032 19.9639 14.1623 17.3225C14.1645 17.2098 14.2114 17.1027 14.2926 17.0246C14.3739 16.9465 14.4828 16.9039 14.5954 16.9061C14.7081 16.9084 14.8152 16.9553 14.8933 17.0365C14.9714 17.1177 15.014 17.2266 15.0118 17.3393V17.3729C14.9075 19.1335 14.8997 21.2157 14.9356 23.2699C14.9367 23.3361 14.9509 23.4014 14.9774 23.4622C15.0038 23.5229 15.0419 23.5778 15.0896 23.6238C15.1373 23.6698 15.1935 23.706 15.2551 23.7302C15.3168 23.7545 15.3826 23.7664 15.4488 23.7652C15.515 23.764 15.5804 23.7498 15.6411 23.7234C15.7019 23.6969 15.7568 23.6588 15.8028 23.6111C15.8488 23.5635 15.8849 23.5072 15.9092 23.4456C15.9335 23.384 15.9453 23.3181 15.9442 23.2519C15.9061 21.1843 15.9173 19.0886 16.0237 17.3225C16.0248 17.2667 16.0369 17.2117 16.0593 17.1606C16.0816 17.1095 16.1138 17.0633 16.1541 17.0246C16.1943 16.9859 16.2417 16.9556 16.2937 16.9353C16.3456 16.9149 16.4011 16.905 16.4569 16.9061C16.5126 16.9072 16.5677 16.9193 16.6188 16.9417C16.6699 16.9641 16.7161 16.9963 16.7547 17.0365C16.7934 17.0767 16.8237 17.1242 16.8441 17.1761C16.8644 17.2281 16.8743 17.2835 16.8732 17.3393C16.8732 17.3505 16.8732 17.3617 16.8732 17.3729C16.7701 19.1245 16.7611 21.1944 16.797 23.2374C16.7991 23.3711 16.8542 23.4985 16.9502 23.5917C17.0463 23.6848 17.1754 23.7359 17.3091 23.7338C17.4429 23.7317 17.5703 23.6766 17.6634 23.5806C17.7565 23.4845 17.8077 23.3554 17.8056 23.2217C17.7675 21.163 17.7787 19.0752 17.8852 17.3214C17.8863 17.2656 17.8983 17.2106 17.9207 17.1595C17.9431 17.1083 17.9753 17.0621 18.0155 17.0235C18.0557 16.9848 18.1032 16.9545 18.1551 16.9341C18.2071 16.9138 18.2625 16.9039 18.3183 16.905C18.3741 16.9061 18.4291 16.9182 18.4802 16.9406C18.5313 16.9629 18.5775 16.9951 18.6162 17.0354C18.6548 17.0756 18.6852 17.123 18.7055 17.175C18.7258 17.2269 18.7357 17.2824 18.7346 17.3382C18.7346 17.3494 18.7346 17.3606 18.7346 17.3718C18.5833 19.9404 18.6326 23.1903 18.7346 26.0424C18.7346 26.0424 18.7346 26.067 18.7346 26.0693C18.7346 26.0715 18.7346 26.0984 18.7346 26.113V26.141C18.7349 26.511 18.6451 26.8755 18.4729 27.2029C18.3006 27.5304 18.0512 27.811 17.7462 28.0204C17.692 28.0578 17.647 28.107 17.6144 28.1642C17.5818 28.2214 17.5625 28.2853 17.5579 28.351C17.5579 28.351 17.5064 28.7891 17.6991 30.9106C17.7899 31.8374 17.8583 32.4795 17.8908 32.7698C17.8979 32.824 17.9246 32.8738 17.9659 32.9097C18.0072 32.9456 18.0602 32.9652 18.1149 32.9647H18.311C18.7178 32.9647 19.1381 32.9647 19.574 32.9647H19.7376H21.32L22.518 32.9748C22.5731 32.9752 22.6263 32.9553 22.6677 32.919C22.709 32.8826 22.7355 32.8323 22.7421 32.7776C23.0201 30.2348 23.0851 28.806 23.0851 28.806C23.0835 28.745 23.06 28.6867 23.0188 28.6418C22.9776 28.5969 22.9215 28.5684 22.8609 28.5616L21.4041 28.361C21.3072 28.3492 21.2161 28.309 21.1419 28.2457C21.0678 28.1823 21.014 28.0985 20.9872 28.0047C20.9689 27.9315 20.9629 27.8557 20.9692 27.7805C21.5509 19.3005 24.3447 16.4461 24.3447 16.4461C24.3861 16.4044 24.4315 16.3669 24.4803 16.334C24.5357 16.2939 24.5996 16.267 24.667 16.2554C24.7345 16.2437 24.8037 16.2477 24.8693 16.267C24.935 16.2862 24.9954 16.3203 25.0459 16.3665C25.0963 16.4127 25.1356 16.4698 25.1605 16.5335C25.1804 16.5999 25.1925 16.6683 25.1964 16.7375C25.4373 19.4013 25.3197 23.9355 25.1706 27.4724C25.044 30.4746 24.8905 32.8314 24.8905 32.8314C24.8905 32.8778 24.9089 32.9222 24.9417 32.955C24.9744 32.9878 25.0189 33.0062 25.0653 33.0062C25.8587 33.0197 26.6342 33.0353 27.468 33.0566H27.4837C27.6442 33.0566 27.8003 33.0035 27.9276 32.9056C28.0548 32.8077 28.1462 32.6705 28.1875 32.5154C28.6884 30.3547 29.084 22.0248 29.1053 21.6516C29.1211 21.5076 29.1799 21.3717 29.2741 21.2616C29.3682 21.1514 29.4933 21.0722 29.6331 21.0341L31.7456 20.6273C31.8495 20.601 31.9463 20.5521 32.0291 20.4839C32.1119 20.4158 32.1785 20.3301 32.2243 20.2332C32.27 20.1362 32.2937 20.0303 32.2937 19.9231C32.2937 19.8159 32.2699 19.7101 32.2241 19.6131V19.6098Z', fill: 'white' }))) : (''),
            m.prevNumber ? (React.createElement("div", null,
                React.createElement("div", null, m.selectedNumber),
                React.createElement("div", null,
                    "[",
                    m.selectedNumber,
                    "+",
                    m.prevNumber,
                    "/3] = ",
                    m.number))) : (''),
            React.createElement("div", null, m.number)));
    });
    var chatDisplay = (React.createElement("div", null,
        chatroomMessagesDisplay,
        activeTurn === true ? (React.createElement("div", { className: 'select-number-container' },
            React.createElement("button", { className: 'select-number number-1', onClick: function () { return onSendNumber(-1); }, value: '-1' }, "-1"),
            React.createElement("button", { className: 'select-number number0', onClick: function () { return onSendNumber(0); }, value: '0' }, "0"),
            React.createElement("button", { className: 'select-number number1', onClick: function () { return onSendNumber(+1); }, value: '+1' }, "+1"))) : ('')));
    return (React.createElement("div", { className: 'chat-container' },
        chatDisplay,
        gameOverMessage));
}
exports["default"] = ChatroomMessages;
