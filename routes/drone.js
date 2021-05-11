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
    drone.leds = {
        led1: "off",
        led2: "off",
        led3: "off",
        led4: "off",
    };

    socket.io.emit("state", drone.state);
    socket.io.emit("leds", drone.leds);

    res.json({ message: "Shutdown" });
});

router.post("/on", serialWrite("D1"), function (req, res, next) {
    const state = "on";
    drone.state = state;
    drone.leds = {
        led1: "on",
        led2: "on",
        led3: "on",
        led4: "on",
    };

    socket.io.emit("state", drone.state);
    socket.io.emit("leds", drone.leds);

    res.json({ message: "Startup" });
});

module.exports = router;
