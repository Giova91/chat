var express = require('express')
	, app = express()
	, http = require('http')
	, server = http.createServer(app)
	, io = require('socket.io').listen(server);

server.listen(3000);

app.get('/', function(req, res) {  
    res.sendfile(__dirname + '/index.html');  
});

var usernames = {};

io.sockets.on('connection', function(socket) {  
     socket.on('sendchat', function(data) {  
         io.sockets.emit('updatechat', socket.username, data);  
     });  
     socket.on('adduser', function(username) {  
         socket.username = username;  
         usernames[username] = username;  
         socket.emit('updatechat', 'SERVER', 'ti sei connesso.');  
         socket.broadcast.emit('updatechat', 'SERVER', username + ' si &egrave; connesso.');  
         io.sockets.emit('updateusers', usernames);  
     });  
     socket.on('disconnect', function() {  
         delete usernames[socket.username];  
         io.sockets.emit('updateusers', usernames);  
         socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' si &egrave; disconnesso');  
     });  
});  