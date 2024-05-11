var express = require('express');
var path = require('path');
const { Socket } = require('socket.io');

var app = express();

app.use(express.static(path.join(__dirname, 'images')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.render('user');
})

users = [];
io.on('connection', function (socket) {
    console.log('A user connected');
    socket.on('createUser', function (data) {
        console.log(data);
        if (users.indexOf(data) >= 0) {
            socket.emit('userExists', data + ' user already exists');
        } else {
            users.push(data);
            socket.emit('setUser', { username: data });
        }
    });
    socket.on('msg', function (data) {
        io.emit('newmsg', data);
    })
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
}); http.listen(2000, function () {
    console.log('listening on localhost:2000');
});