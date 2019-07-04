require('./config/include.modules'); // include modules.
require('./config/database'); // database config.
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
var totalUsers = 0;
io.on('connection', function (socket) {
    console.log('connection');
    socket.on('add user', function (username) {
        ++totalUsers;
        // storing usernames in socket sessions.
        const socket_id = socket.id;
        socket.username = username;
        socket.socket_id = socket_id;
        // console socket session variables.
        console.log(socket.username);
        console.log(socket.socket_id);
        socket.emit('new user notification', totalUsers);
        // send to connected same user who connected in chat.
        io.to(socket.socket_id).emit('welcome message', {
            username: socket.username,
            socket_id: socket.socket_id
        });
        socket.broadcast.emit('global welcome message', {
            username: socket.username,
            socket_id: socket.socket_id
        });
    });
    socket.on('chat message', function (messageReceived) {
        io.emit('chat message', {
            username: socket.username,
            socket_id: socket.socket_id,
            message: messageReceived
        });
    });
    /**
     * When socket disconnect
     */
    socket.on('disconnect', function () {
        --totalUsers;
        socket.broadcast.emit('user left', {
            username: socket.username,
            socket_id: socket.id
        });
    });
    /**
     * Private socket message.
     */
    socket.on('private socket message', function (data) {
        var socket_id = data.socket_id;
        var message = data.message;
        console.log(socket_id + '<-->' + message);
        io.to(socket_id).emit("private socket message", message);
    });
    /**
     * Broadcast socket message.
     */
    socket.on('broadcast socket message', function (data) {
        var broadcastmessage = data.message;
        console.log(broadcastmessage);
        socket.broadcast.emit("broadcast socket message", broadcastmessage);
        //io.local.emit('broadcast socket message', broadcastmessage);
    });
});
http.listen(3000);