import { Router } from "express";

var router = Router();

import timer, { startTimer, stopTimer, resetTimer } from "../timer";
import procedures from "../procedures-list";
import commands from "../commands";
import drone from "../drone";

router.get("/:name", function (req, res, next) {
    res.json({ message: "Ok", procedure: procedures[req.params.name] });
});

router.post("/:name/start", function (req, res, next) {
    const procedure = procedures[req.params.name];

    drone.setProcedure(req.params.name);

    if (!timer.canReset) {
        res.status(500).json({ message: "Cannot be start." });
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

router.post("/:name/reset", function (req, res, next) {
    if (!timer.canReset) {
        res.status(500).json({
            error: true,
            message: "Timer cannot be reset.",
        });
        return;
    }
    drone.setProcedure(undefined);
    resetTimer();
    res.json({ message: "Ok" });
});

export default router;