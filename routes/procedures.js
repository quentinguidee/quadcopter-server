var express = require("express");
var router = express.Router();

const { startTimer, stopTimer, timer } = require("../timer");
const procedures = require("../procedures-list");
const { commands } = require("../commands");
const drone = require("../drone");

router.get("/:name", function (req, res, next) {
    res.json({ message: "Ok", procedure: procedures[req.params.name] });
});

router.post("/:name/start", function (req, res, next) {
    const procedure = procedures[req.params.name];

    drone.setProcedure(req.params.name);

    if (timer.running) {
        res.status(500).json({ message: "Already running." });
        return;
    }

    if (timer.finished) {
        res.status(500).json({ message: "Already finished." });
        return;
    }

    startTimer(procedure.start, procedure.stop, (time) => {
        procedure.events.forEach((event) => {
            if (
                event.time.minus === timer.current.minus &&
                event.time.minutes === timer.current.minutes &&
                event.time.seconds === timer.current.seconds
            ) {
                event
                    .do()
                    .then((res) => console.log(res))
                    .catch((err) => {
                        console.error(err);
                        event
                            .ifFail()
                            .then((res) => console.log(res))
                            .catch((err) => {
                                console.error(err);
                                commands.emergencyStop();
                            });
                    });
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
