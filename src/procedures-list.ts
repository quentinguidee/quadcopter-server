import commands from "./commands";

const procedures = {
    "motors-test": {
        start: { minus: true, minutes: 0, seconds: 14 },
        stop: { minus: false, minutes: 0, seconds: 8 },
        events: [
            {
                name: "Connect",
                time: { minus: true, minutes: 0, seconds: 10 },
                do: commands.connect,
                ifFail: commands.forceStopCountdown,
            },
            {
                name: "Startup",
                time: { minus: true, minutes: 0, seconds: 5 },
                do: commands.on,
                ifFail: commands.forceStopCountdown,
            },
            {
                name: "Motors on",
                time: { minus: true, minutes: 0, seconds: 0 },
                do: commands.startMotorsTest,
                ifFail: commands.forceStopCountdown,
            },
            {
                name: "Motors off",
                time: { minus: false, minutes: 0, seconds: 3 },
                do: commands.stopMotorsTest,
                ifFail: commands.emergencyStop,
            },
            {
                name: "Shutdown",
                time: { minus: false, minutes: 0, seconds: 6 },
                do: commands.off,
                ifFail: commands.emergencyStop,
            },
        ],
    },
};

export default procedures;
