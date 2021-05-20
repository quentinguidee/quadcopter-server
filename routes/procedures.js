var express = require("express");
var router = express.Router();

const { startTimer, stopTimer } = require("../timer");
const procedures = require("../procedures-list");

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
