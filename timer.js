const socket = require("./socket");

let time = {
    minus: false,
    minutes: 0,
    seconds: 0,
};

let interval;

let running = false;

function increment(current) {
    const { minus, minutes, seconds } = current;

    if (minutes === 0 && seconds === 0) {
        return { ...current, minus: false, seconds: 1 };
    }

    if (minus) {
        if (seconds === 0) {
            return { ...current, minutes: minutes - 1, seconds: 59 };
        }
        return { ...current, seconds: seconds - 1 };
    }

    if (seconds === 59) {
        return { ...current, minutes: minutes + 1, seconds: 0 };
    }

    return { ...current, seconds: seconds + 1 };
}

function startTimer(start, stop, action) {
    if (running) {
        stopTimer();
    }

    running = true;
    time = start;
    socket.io.emit("timer", time);
    console.log("a");
    interval = setInterval(() => {
        time = increment(time);
        socket.io.emit("timer", time);

        if (
            time.minus === stop.minus &&
            time.minutes >= stop.minutes &&
            time.seconds >= stop.seconds
        ) {
            stopTimer();
        }

        action(time);
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
    running = false;
}

module.exports = { time, startTimer, stopTimer };
