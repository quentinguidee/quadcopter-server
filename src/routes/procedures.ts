import { Router } from "express";

var router = Router();

import timer from "../timer";
import procedures from "../procedures-list";
import commands from "../commands";
import drone from "../drone";

router.get("/:name", function (req, res, next) {
    const procedure = procedures[req.params.name];

    if (procedure === undefined) {
        res.status(500).json({ error: true, message: "Procedure not found" });
    }

    res.json({ message: "ok", procedure });
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

    timer.reset(procedure.start);
    timer.start(procedure.stop, (time) => {
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

    res.json({ message: "ok" });
});

router.post("/:name/stop", function (req, res, next) {
    timer.stop();
    res.json({ message: "ok" });
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
    timer.reset();
    res.json({ message: "ok" });
});

export default router;
