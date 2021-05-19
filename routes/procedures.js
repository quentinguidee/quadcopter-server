var express = require("express");
const { startTimer, stopTimer } = require("../timer");
var router = express.Router();

const procedures = {
    "motors-test": {
        start: { minus: true, minutes: 0, seconds: 20 },
        stop: { minus: false, minutes: 0, seconds: 13 },
        events: [
            {
                name: "Connect",
                time: { minus: true, minutes: 0, seconds: 15 },
                request: "/drone/connect",
            },
            {
                name: "Startup",
                time: { minus: true, minutes: 0, seconds: 10 },
                request: "/drone/on",
            },
            {
                name: "Motors on",
                time: { minus: true, minutes: 0, seconds: 0 },
                request: "/motorstest/on",
            },
            {
                name: "Motors off",
                time: { minus: false, minutes: 0, seconds: 5 },
                request: "/motorstest/off",
            },
            {
                name: "Shutdown",
                time: { minus: false, minutes: 0, seconds: 10 },
                request: "/drone/off",
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
    startTimer(procedure.start, procedure.stop);
    res.json({ message: "Ok" });
});

router.post("/:name/stop", function (req, res, next) {
    stopTimer();
    res.json({ message: "Ok" });
});

module.exports = router;
