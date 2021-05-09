var express = require("express");
const serial = require("../serial");
var router = express.Router();

router.post("/", function (req, res, next) {
    const action = Number.parseInt(req.query.action);

    serial.write(`$D${action}\n`);

    res.json({
        action: Number.parseInt(req.query.action),
    });
});

module.exports = router;
