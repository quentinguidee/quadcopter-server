import { serialWrite, connect as serialConnect } from "./serial";
import { stopTimer } from "./timer";

const commands = {
    connect: serialConnect,

    stopCountdown: stopCountdown,

    emergencyStop: emergencyStop,

    off: () => serialWrite("D0"),
    on: () => serialWrite("D1"),
    startMotorsTest: () => serialWrite("D4"),
    stopMotorsTest: () => serialWrite("D5"),
};

function stopCountdown() {
    return new Promise((resolve) => {
        stopTimer();
        resolve("");
    });
}

function emergencyStop() {
    return new Promise((resolve) => {
        // Do emergency stop
        resolve("");
    });
}

export function executeCommandMiddleware(command) {
    return async (req, res, next) => {
        command()
            .then((result) => {
                next();
            })
            .catch((err) => {
                res.status(500).json(err);
            });
    };
}

export default commands;
