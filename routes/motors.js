var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
    let id = Number.parseInt(req.query.id);
    let action = Number.parseInt(req.query.action);

    res.json({
        id: id,
        action: action,
    });
});

module.exports = router;
