import { Router } from "express";

var router = Router();

router.get("/", function (req, res, next) {
    res.json("Hello, World!");
});

export default router;
