const { commands } = require("./commands");

const procedures = {
    "motors-test": {
        start: { minus: true, minutes: 0, seconds: 20 },
        stop: { minus: false, minutes: 0, seconds: 13 },
        events: [
            {
                name: "Connect",
                time: { minus: true, minutes: 0, seconds: 15 },
                do: commands.connect,
                ifFail: commands.stopCountdown,
            },
            {
                name: "Startup",
                time: { minus: true, minutes: 0, seconds: 10 },
                do: commands.on,
                ifFail: commands.stopCountdown,
            },
            {
                name: "Motors on",
                time: { minus: true, minutes: 0, seconds: 0 },
                do: commands.startMotorsTest,
                ifFail: commands.stopCountdown,
            },
            {
                name: "Motors off",
                time: { minus: false, minutes: 0, seconds: 5 },
                do: commands.stopMotorsTest,
                ifFail: commands.emergencyStop,
            },
            {
                name: "Shutdown",
                time: { minus: false, minutes: 0, seconds: 10 },
                do: commands.off,
                ifFail: commands.emergencyStop,
            },
        ],
    },
};

module.exports = procedures;
