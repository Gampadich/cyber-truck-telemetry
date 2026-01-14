const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const truckSimTelemetry = require('trucksim-telemetry');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const telemetry = truckSimTelemetry;

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
});

setInterval(() => {
    const data = telemetry.data;

    if (!data) return;

    const payload = {
        connected: true,
        game: data.game?.gameName || 'unknown',
        truck: {
            speed: Math.floor((data.truck?.speed || 0) * 3.6),
            rpm: Math.floor(data.truck?.engine?.rpm || 0),
            gear: data.truck?.transmission?.gear?.displayed || 'N',
            fuel: data.truck?.fuel?.value || 0,
        }
    };

    io.emit('telemetry', payload);

}, 100); 

server.listen(3000, () => {
    console.log('Server started on port 3000');
});