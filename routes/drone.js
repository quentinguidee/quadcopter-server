var express = require("express");
const { setState } = require("../drone");
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
    setState(state);
    socket.io.emit("state", state);
    res.json({ message: "Shutdown" });
});

router.post("/on", serialWrite("D1"), function (req, res, next) {
    const state = "on";
    setState(state);
    socket.io.emit("state", state);
    res.json({ message: "Startup" });
});

module.exports = router;
