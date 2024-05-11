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

users = [];   // using an empty array to store the users

io.on('connection', function (socket) {
    console.log('A user connected');  // When a new user is connected it will print a user connected on console
    socket.on('createUser', function (data) {
        console.log(data);
        if (users.indexOf(data) >= 0) {  // it check whether a user already exits or not. If user already exists then it wont add the user into the array
            socket.emit('userExists', data + ' user already exists');
        } else {
            users.push(data);   // if the user does not exists it will add the user into the array
            socket.emit('setUser', { username: data });
        }
    });
    socket.on('msg', function (data) {
        io.emit('newmsg', data);  // when a new user writes a message it will display the message to all that are connected
    })
    socket.on('disconnect', function () {
        console.log('A user disconnected');  // if a user gets disconnected it'll print A user disconnected on the console
    });
}); http.listen(2000, function () {
    console.log('listening on localhost:2000');
});
