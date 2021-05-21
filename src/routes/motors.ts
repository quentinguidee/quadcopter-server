import { Router } from "express";

var router = Router();

router.post("/", function (req, res, next) {
    let id = Number.parseInt(req.query.id as string);
    let action = Number.parseInt(req.query.action as string);

    res.json({
        id: id,
        action: action,
    });
});

export default router;
