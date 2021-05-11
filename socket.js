const io = require("socket.io")({
    cors: true,
});

const socket = {
    io: io,
};

socket.io.on("connection", (socket) => {
    console.log("Client connected");
});

module.exports = socket;
