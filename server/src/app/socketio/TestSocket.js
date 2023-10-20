const app = require('express')();
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const port = 8081;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'localhost:8081',
        methods: ['GET', 'POST'],
    }
})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'resources/test.html'))
})

io.on('connection', (socket) => {
    console.log('Một người dùng đã kết nối');

    socket.on('chat-message', (msg) => {
        console.log('server : ', msg);
        io.emit('user-message', msg); // Gửi tin nhắn chat tới tất cả người dùng
    });

    socket.on('disconnect', () => {
        console.log('Một người dùng đã ngắt kết nối');
    });
});

server.listen(port, () => {
    console.log(`localhost:${port}`)
});