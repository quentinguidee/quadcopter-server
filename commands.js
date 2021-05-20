const { serialWrite, connect: serialConnect } = require("./serial");
const { stopTimer } = require("./timer");

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
        resolve();
    });
}

function emergencyStop() {
    return new Promise((resolve) => {
        // Do emergency stop
        resolve();
    });
}

function executeCommandMiddleware(command) {
    return async (req, res, next) => {
        command()
            .then((result) => {
                console.log(result);
                next();
            })
            .catch((err) => {
                res.status(500).json(err);
                console.error(err);
            });
    };
}

module.exports = { commands, executeCommandMiddleware };
