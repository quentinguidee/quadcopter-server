import { Router } from "express";

import commands, { executeCommandMiddleware as execute } from "../commands";

var router = Router();

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

export default router;
