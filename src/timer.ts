import socket from "./socket";

export interface ITime {
    minus: boolean;
    minutes: number;
    seconds: number;
}

export class Timer {
    current: ITime;

    canReset = true;
    finished = false;
    forceStopped = false;

    interval = undefined;

    incremented() {
        const { minus, minutes, seconds } = this.current;

        if (minutes === 0 && seconds === 0) {
            return { ...this.current, minus: false, seconds: 1 };
        }

        if (minus) {
            if (seconds === 0) {
                return { ...this.current, minutes: minutes - 1, seconds: 59 };
            }
            return { ...this.current, seconds: seconds - 1 };
        }

        if (seconds === 59) {
            return { ...this.current, minutes: minutes + 1, seconds: 0 };
        }

        return { ...this.current, seconds: seconds + 1 };
    }

    getCurrentState() {
        return {
            canReset: this.canReset,
            finished: this.finished,
            current: this.current,
            forceStopped: this.forceStopped,
        };
    }

    start(until?: ITime, onTick?: (current) => void) {
        this.canReset = false;

        this.emit();

        this.interval = setInterval(() => {
            this.current = this.incremented();

            if (
                until &&
                this.current.minus === until.minus &&
                this.current.minutes >= until.minutes &&
                this.current.seconds >= until.seconds
            ) {
                this.stop();
                this.finished = true;
                this.canReset = true;
            }

            this.emit();

            onTick(this.current);
        }, 1000);
    }

    stop(force: boolean = false) {
        clearInterval(this.interval);
        this.canReset = true;
        this.forceStopped = force;

        this.emit();
    }

    reset(time: ITime = { minus: true, minutes: 2, seconds: 0 }) {
        this.stop();

        this.canReset = true;
        this.finished = false;
        this.current = time;
        this.forceStopped = false;

        this.emit();
    }

    emit() {
        socket.io.emit("timer", this.getCurrentState());
    }
}

const timer = new Timer();

export default timer;
