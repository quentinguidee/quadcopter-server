import express from "express";

import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import motorsRouter from "./routes/motors";
import droneRouter from "./routes/drone";
import proceduresRouter from "./routes/procedures";

var app = express();

app.set("view engine", "jade");

app.use(cors());

if (process.env.JEST_WORKER_ID === undefined) {
    app.use(logger("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/motors", motorsRouter);
app.use("/drone/", droneRouter);
app.use("/procedures/", proceduresRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
});

export default app;
