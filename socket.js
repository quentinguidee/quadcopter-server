const io = require("socket.io")({
    cors: true,
});

const socket = {
    io: io,
};

module.exports = socket;
