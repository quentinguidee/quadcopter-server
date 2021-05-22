import socket from "./socket";
import timer from "./timer";

type State =
    | "disconnected"
    | "failed-to-setup"
    | "in-setup"
    | "on"
    | "off"
    | "motorstest";

type Accelerometer = "disconnected" | "on";
type Coordinate = { x: number; y: number; z: number };
type Led = "disconnected" | "on" | "off";
type MotorState = "disconnected" | "on" | "off" | "failed-to-setup";
type Procedure = string;

type Leds = {
    led1: Led;
    led2: Led;
    led3: Led;
    led4: Led;
};

type Motor = {
    state: MotorState;
    speed: number;
};

type Motors = {
    motor1: Motor;
    motor2: Motor;
    motor3: Motor;
    motor4: Motor;
};

export class Drone {
    state: State = "disconnected";
    procedure: Procedure = undefined;
    accelerometer: Accelerometer = "disconnected";
    position: Coordinate = { x: 0, y: 0, z: 0 };
    angle: Coordinate = { x: 0, y: 0, z: 0 };
    leds: Leds = {
        led1: "disconnected",
        led2: "disconnected",
        led3: "disconnected",
        led4: "disconnected",
    };
    motors: Motors = {
        motor1: {
            state: "disconnected",
            speed: undefined,
        },
        motor2: {
            state: "disconnected",
            speed: undefined,
        },
        motor3: {
            state: "disconnected",
            speed: undefined,
        },
        motor4: {
            state: "disconnected",
            speed: undefined,
        },
    };

    telemetryLost() {
        this.reset();
    }

    reset() {
        this.disconnected();
        this.setAccelerometerState("disconnected");
        this.setPosition({ x: 0, y: 0, z: 0 });
        this.setAngle({ x: 0, y: 0, z: 0 });
        this.ledDisconnected(1);
        this.ledDisconnected(2);
        this.ledDisconnected(3);
        this.ledDisconnected(4);
        this.motorDisconnected(1);
        this.motorDisconnected(2);
        this.motorDisconnected(3);
        this.motorDisconnected(4);
    }

    on = () => this.setState("on");
    off = () => this.setState("off");
    disconnected = () => this.setState("disconnected");
    startMotorsTest = () => this.setState("motorstest");
    stopMotorsTest = () => this.setState("on");
    failedToSetup = () => this.setState("failed-to-setup");
    inSetup = () => this.setState("in-setup");

    setState(state: State) {
        this.state = state;
        socket.io.emit("state", this.state);
    }

    setProcedure(procedure: Procedure) {
        this.procedure = procedure;
        socket.io.emit("procedure", this.procedure);
    }

    accelerometerOn = () => this.setAccelerometerState("on");
    accelerometerDisconnected = () =>
        this.setAccelerometerState("disconnected");

    setAccelerometerState(state: Accelerometer) {
        this.accelerometer = state;
        socket.io.emit("accelerometer", this.accelerometer);
    }

    setPosition(position: Coordinate) {
        this.position = position;
    }

    setAngle(angle: Coordinate) {
        this.angle = angle;
    }

    ledOn = (id: number) => this.setLedState(id, "on");
    ledOff = (id: number) => this.setLedState(id, "off");
    ledDisconnected = (id: number) => this.setLedState(id, "disconnected");

    setLedState(id: number, state: Led) {
        this.leds[`led${id}`] = state;
        socket.io.emit("leds", this.leds);
    }

    motorOn = (id: number) => this.setMotorState(id, "on");
    motorOff = (id: number) => this.setMotorState(id, "off");
    motorDisconnected = (id: number) => this.setMotorState(id, "disconnected");
    motorFailedToSetup = (id: number) =>
        this.setMotorState(id, "failed-to-setup");

    setMotorState(id: number, state: MotorState) {
        const motor = this.motors[`motor${id}`];
        motor.state = state;
        if (state === "disconnected" || state === "off") {
            motor.speed = undefined;
        }
    }

    setMotorSpeed(id: number, speed: number) {
        this.motors[`motor${id}`].speed = speed;
    }

    emergencyStop() {
        console.log("Emergency Stop.");
        timer.stop();
    }
}

const drone: Drone = new Drone();

setInterval(() => {
    socket.io.emit("motors", drone.motors);
    socket.io.emit("position", drone.position);
    socket.io.emit("angle", drone.angle);
}, 200);

export default drone;
