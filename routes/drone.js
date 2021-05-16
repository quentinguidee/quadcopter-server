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
    res.json({ message: "Send shutdown command" });
});

router.post("/on", serialWrite("D1"), function (req, res, next) {
    res.json({ message: "Send startup command" });
});

router.post("/motorstest/on", serialWrite("D4"), function (req, res, next) {
    res.json({ message: "Send start motors test command" });
});

router.post("/motorstest/off", serialWrite("D5"), function (req, res, next) {
    res.json({ message: "Send stop motors test command" });
});

module.exports = router;
