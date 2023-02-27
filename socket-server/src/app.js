const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const CHAT = 'chat'

io.on('connection', (socket) => {
    socket.on(CHAT, msg => {
        io.emit(CHAT, msg);
    })
})

const port = 3000

httpServer.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
