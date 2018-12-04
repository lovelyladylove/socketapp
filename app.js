const express = require('express');
const app = express();
const ServerIO = require('socket.io');
require('./libs/db-connection');

// listen
var server = app.listen(process.env.PORT || 4000, () => {
  console.log('Server Running');
});

const io = ServerIO(server);


app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

const Chat = require('./models/Chat');

app.get('/', (req, res) => {
  Chat.find({}).then(messages => {
    res.render('index', {messages});
  }).catch(err => console.error(err));
});

io.on('connection', socket => {
  socket.on('chat', data => {
    var date = new Date();
    Chat.createdAt = date.toLocaleTimeString();
    
    Chat.create({name: data.handle, message: data.message, createdAt: Chat.createdAt}).then(() => {
      io.sockets.emit('chat', data); // return data
    }).catch(err => console.error(err));
  });
  socket.on('typing', data => {
    socket.broadcast.emit('typing', data); // return data
  });
});

