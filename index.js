import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {db} from './connection/index.js';
import { Server } from 'socket.io';
const app = express();
const server = createServer(app);
const io = new Server(server,{
  cors: {
    origin:"*",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  return res.json({
    message: 'stream chat',
  });
});

io.on('connection', (socket) => {
    db.query(`SELECT * FROM message_chats`, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        socket.emit('chatHistory',results);
    })
  socket.on('chat message', (msg) => {
    try {
        db.query(`INSERT INTO message_chats (message) VALUES ("${msg}")`)
        io.emit('chat message', msg);
    } catch (error) {
        console.log(error)
    }
  });
});



server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
