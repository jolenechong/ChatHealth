const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.get('/test', (req, res) => {
    return res.send('Hello World');
});

//static folder
app.use(express.static(path.join(__dirname, "public")));

//run when client connects
const botName = "ChatHealth Admin"
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
      const user = userJoin(socket.id, username, room);
  
      socket.join(user.room);
  
      // welcome current user
      socket.emit('message', formatMessage(botName, 'Welcome to ChatHealth!'));
  
      // broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          'message',
          formatMessage(botName, `${user.username} has joined the chat`)
        );
  
      // send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });
  
    // Listen for chatMessage
    socket.on('chatMessage', msg => {
      const user = getCurrentUser(socket.id);
  
      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
  
    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
  
      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.username} has left the chat`)
        );
  
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });

const PORT = process.env.PORT || 3000;
// processs.env.POST allows us to post on heroku for eg
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
