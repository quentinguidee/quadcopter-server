#!/usr/bin/env node

import app from "../app";
import http from "http";
import socket from "../socket";
import drone from "../database/drone";
import timer from "../timer";

var debug = require("debug")("quadcopter-server:server");

var port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

var server = http.createServer(app);
socket.io.attach(server);
socket.io.on("connection", (socket) => {
    console.log("Client connected");

    drone.state.get().then((state) => socket.emit("state", state));
    drone.leds.get().then((leds) => socket.emit("leds", leds));

    drone.accelerometer
        .get()
        .then((accelerometer) => socket.emit("accelerometer", accelerometer));

    drone.procedure
        .get()
        .then((procedure) => socket.emit("procedure", procedure));

    socket.emit("timer", timer.getCurrentState());
});

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
}
