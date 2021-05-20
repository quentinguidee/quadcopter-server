var express = require("express");
const { drone } = require("../drone");
const socket = require("../socket");
const { connect, serialWrite } = require("../serial");
const { executeCommandMiddleware: execute, commands } = require("../commands");
var router = express.Router();

router.post("/connect", execute(commands.connect), function (req, res, next) {
    res.json({ message: "Connected" });
});

router.post("/off", execute(commands.off), function (req, res, next) {
    res.json({ message: "Send shutdown command" });
});

router.post("/on", execute(commands.on), function (req, res, next) {
    res.json({ message: "Send startup command" });
});

router.post(
    "/motorstest/on",
    execute(commands.startMotorsTest),
    function (req, res, next) {
        res.json({ message: "Send start motors test command" });
    }
);

router.post(
    "/motorstest/off",
    execute(commands.stopMotorsTest),
    function (req, res, next) {
        res.json({ message: "Send stop motors test command" });
    }
);

module.exports = router;
