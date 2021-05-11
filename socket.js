const { drone } = require("./drone");

const io = require("socket.io")({
    cors: true,
});

const socket = {
    io: io,
};

socket.io.on("connection", (socket) => {
    console.log("Client connected");
    socket.emit("state", drone.state);
    socket.emit("leds", drone.leds);
});

module.exports = socket;
