var express = require("express");
const { drone } = require("../drone");
const socket = require("../socket");
const { connect, serialWrite } = require("../serial");
var router = express.Router();

router.post("/connect", function (req, res, next) {
    connect()
        .then(() => {
            res.json({ message: "Connected" });
        })
        .catch((err) => {
            res.status(500).json({ message: err.message });
        });
});

router.post("/off", serialWrite("D0"), function (req, res, next) {
    const state = "off";
    drone.state = state;

    socket.io.emit("state", drone.state);

    res.json({ message: "Shutdown" });
});

router.post("/on", serialWrite("D1"), function (req, res, next) {
    const state = "on";
    drone.state = state;

    socket.io.emit("state", drone.state);

    res.json({ message: "Startup" });
});

module.exports = router;
