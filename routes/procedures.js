var express = require("express");
const { default: fetch } = require("node-fetch");
const { emergencyStop } = require("../drone");
const drone = require("../drone");
const { startTimer, stopTimer } = require("../timer");
const { connect } = require("../serial");
var router = express.Router();

const procedures = {
    "motors-test": {
        start: { minus: true, minutes: 0, seconds: 20 },
        stop: { minus: false, minutes: 0, seconds: 13 },
        events: [
            {
                name: "Connect",
                time: { minus: true, minutes: 0, seconds: 15 },
                do: connect,
                ifFail: stopTimer,
            },
            {
                name: "Startup",
                time: { minus: true, minutes: 0, seconds: 10 },
                do: drone.on,
                ifFail: stopTimer,
            },
            {
                name: "Motors on",
                time: { minus: true, minutes: 0, seconds: 0 },
                do: drone.startMotorsTest,
                ifFail: stopTimer,
            },
            {
                name: "Motors off",
                time: { minus: false, minutes: 0, seconds: 5 },
                do: drone.stopMotorsTest,
                ifFail: emergencyStop,
            },
            {
                name: "Shutdown",
                time: { minus: false, minutes: 0, seconds: 10 },
                do: drone.off,
                ifFail: emergencyStop,
            },
        ],
    },
};

/**
 * test-motors/        => Retourne la procédure
 *            /start   => Démarre la procédure
 *            /stop    => Arrête la procédure
 */

router.get("/:name", function (req, res, next) {
    res.json({ message: "Ok", procedure: procedures[req.params.name] });
});

router.post("/:name/start", function (req, res, next) {
    const procedure = procedures[req.params.name];

    startTimer(procedure.start, procedure.stop, (time) => {
        procedure.events.forEach((event) => {
            if (
                event.time.minus === time.minus &&
                event.time.minutes === time.minutes &&
                event.time.seconds === time.seconds
            ) {
                event.do();
                // else event.ifFail()
            }
        });
    });

    res.json({ message: "Ok" });
});

router.post("/:name/stop", function (req, res, next) {
    stopTimer();
    res.json({ message: "Ok" });
});

module.exports = router;
