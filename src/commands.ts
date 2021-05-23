import serial, { serialWrite, connect as serialConnect } from "./serial";
import timer from "./timer";

const commands = {
    connect: connect,
    connectIfNotConnected: () => connect(false),

    forceStopCountdown: forceStopCountdown,

    emergencyStop: emergencyStop,

    off: () => serialWrite("D0"),
    on: () => serialWrite("D1"),
    liftoff: () => serialWrite("D2"),
    landing: () => serialWrite("D3"),
    startMotorsTest: () => serialWrite("D4"),
    stopMotorsTest: () => serialWrite("D5"),
};

function forceStopCountdown() {
    return new Promise((resolve) => {
        timer.stop(true);
        resolve("");
    });
}

function emergencyStop() {
    return new Promise((resolve) => {
        // Do emergency stop
        resolve("");
    });
}

function connect(rejectIfAlreadyConnected: boolean = true) {
    if (serial.connection === undefined || rejectIfAlreadyConnected) {
        return serialConnect();
    }

    return new Promise((resolve) => {
        resolve({ message: "Serial communication already opened" });
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
