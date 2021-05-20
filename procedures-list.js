const drone = require("./drone");

const { connect } = require("./serial");
const { emergencyStop } = require("./drone");
const { stopTimer } = require("./timer");

const procedures = {
    "motors-test": {
        start: { minus: true, minutes: 0, seconds: 20 },
        stop: { minus: false, minutes: 0, seconds: 13 },
        events: [
            {
                name: "Connect",
                time: { minus: true, minutes: 0, seconds: 15 },
                do: connect,
                ifFail: stopTimer,
            },
            {
                name: "Startup",
                time: { minus: true, minutes: 0, seconds: 10 },
                do: drone.on,
                ifFail: stopTimer,
            },
            {
                name: "Motors on",
                time: { minus: true, minutes: 0, seconds: 0 },
                do: drone.startMotorsTest,
                ifFail: stopTimer,
            },
            {
                name: "Motors off",
                time: { minus: false, minutes: 0, seconds: 5 },
                do: drone.stopMotorsTest,
                ifFail: emergencyStop,
            },
            {
                name: "Shutdown",
                time: { minus: false, minutes: 0, seconds: 10 },
                do: drone.off,
                ifFail: emergencyStop,
            },
        ],
    },
};

module.exports = procedures;
