const { getState } = require("./drone");

const io = require("socket.io")({
    cors: true,
});

const socket = {
    io: io,
};

socket.io.on("connection", (socket) => {
    console.log("Client connected");
    const state = getState();
    socket.emit("state", state);
});

module.exports = socket;
