const socket = require("./socket");

let interval;

const timer = {
    canReset: true,
    finished: false,
    current: {
        minus: false,
        minutes: 2,
        seconds: 0,
    },
};

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
    if (timer.canReset) {
        stopTimer();
    }

    timer.canReset = false;
    timer.current = start;
    socket.io.emit("timer", timer);
    console.log("a");
    interval = setInterval(() => {
        timer.current = increment(timer.current);

        if (
            timer.current.minus === stop.minus &&
            timer.current.minutes >= stop.minutes &&
            timer.current.seconds >= stop.seconds
        ) {
            stopTimer();
            timer.finished = true;
            timer.canReset = true;
        }

        socket.io.emit("timer", timer);
        action(timer.current);
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
}

function resetTimer() {
    stopTimer();

    timer.canReset = true;
    timer.finished = false;
    timer.current = {
        minus: false,
        minutes: 2,
        seconds: 0,
    };

    socket.io.emit("timer", timer);
}

module.exports = { timer, startTimer, stopTimer, resetTimer };
