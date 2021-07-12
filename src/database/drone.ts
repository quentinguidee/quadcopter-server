import socket from "../socket";
import timer from "../timer";
import { HashParent, HashValue, Value } from "./abstraction";

type State =
    | "disconnected"
    | "failed-to-setup"
    | "in-setup"
    | "on"
    | "off"
    | "motorstest";

type Accelerometer = "disconnected" | "on";

type Coordinate = number | undefined;

type Led = "disconnected" | "on" | "off";

type MotorState = "disconnected" | "on" | "off" | "failed-to-setup";

type MotorSpeed = number;

type Procedure = string | undefined;

class Coordinates extends HashParent {
    x = new HashValue<Coordinate>(this.key, "x", undefined);
    y = new HashValue<Coordinate>(this.key, "y", undefined);
    z = new HashValue<Coordinate>(this.key, "z", undefined);
}

class Leds extends HashParent {
    led1 = new HashValue<Led>(this.key, "led1", "disconnected");
    led2 = new HashValue<Led>(this.key, "led2", "disconnected");
    led3 = new HashValue<Led>(this.key, "led3", "disconnected");
    led4 = new HashValue<Led>(this.key, "led4", "disconnected");
}

class MotorsSpeeds extends HashParent {
    motor1 = new HashValue<MotorSpeed>(this.key, "motor1", undefined);
    motor2 = new HashValue<MotorSpeed>(this.key, "motor2", undefined);
    motor3 = new HashValue<MotorSpeed>(this.key, "motor3", undefined);
    motor4 = new HashValue<MotorSpeed>(this.key, "motor4", undefined);
}

class MotorsStates extends HashParent {
    motor1 = new HashValue<MotorState>(this.key, "motor1", "disconnected");
    motor2 = new HashValue<MotorState>(this.key, "motor2", "disconnected");
    motor3 = new HashValue<MotorState>(this.key, "motor3", "disconnected");
    motor4 = new HashValue<MotorState>(this.key, "motor4", "disconnected");
}

class Drone {
    public procedure = new Value<Procedure>("procedure", undefined);

    public state = new Value<State>("state", "disconnected");
    public accelerometer = new Value<Accelerometer>(
        "accelerometer",
        "disconnected"
    );

    public position = new Coordinates("position");
    public angle = new Coordinates("angle");

    public leds = new Leds("leds");

    public motorsSpeeds = new MotorsSpeeds("motors_speeds");
    public motorsStates = new MotorsStates("motors_states");

    on = () => this.setState("on");
    off = () => this.setState("off");
    disconnected = () => this.setState("disconnected");
    startMotorsTest = () => this.setState("motorstest");
    stopMotorsTest = () => this.setState("on");
    failedToSetup = () => this.setState("failed-to-setup");
    inSetup = () => this.setState("in-setup");
    telemetryLost = () => this.reset();

    reset() {
        this.disconnected();
        this.setAccelerometerState("disconnected");
        this.setPosition(0, 0, 0);
        this.setAngle(0, 0, 0);
        this.ledDisconnected(1);
        this.ledDisconnected(2);
        this.ledDisconnected(3);
        this.ledDisconnected(4);
        this.motorDisconnected(1);
        this.motorDisconnected(2);
        this.motorDisconnected(3);
        this.motorDisconnected(4);
    }

    setState(state: State) {
        this.state.set(state);
        socket.io.emit("state", state);
    }

    setProcedure(procedure: Procedure) {
        this.procedure.set(procedure);
        socket.io.emit("procedure", procedure);
    }

    accelerometerOn = () => this.setAccelerometerState("on");
    accelerometerDisconnected = () =>
        this.setAccelerometerState("disconnected");

    setAccelerometerState(state: Accelerometer) {
        this.accelerometer.set(state).then(() => {
            this.accelerometer
                .get()
                .then((res) => socket.io.emit("accelerometer", res));
        });
    }

    setPosition(x: number, y: number, z: number) {
        this.position.x.set(x);
        this.position.y.set(y);
        this.position.z.set(z);
    }

    setAngle(x: number, y: number, z: number) {
        this.angle.x.set(x);
        this.angle.y.set(y);
        this.angle.z.set(z);
    }

    ledOn = (id: number) => this.setLedState(id, "on");
    ledOff = (id: number) => this.setLedState(id, "off");
    ledDisconnected = (id: number) => this.setLedState(id, "disconnected");

    setLedState(id: number, state: Led) {
        this.leds[`led${id}`] = state;
        this.leds.get().then((leds) => socket.io.emit("leds", leds));
    }

    motorOn = (id: number) => this.setMotorState(id, "on");
    motorOff = (id: number) => this.setMotorState(id, "off");
    motorDisconnected = (id: number) => this.setMotorState(id, "disconnected");
    motorFailedToSetup = (id: number) =>
        this.setMotorState(id, "failed-to-setup");

    setMotorState(id: number, state: MotorState) {
        let newState: any = state;
        if (state === "disconnected" || state === "off") {
            newState = undefined;
        }

        switch (id) {
            case 1:
                this.motorsStates.motor1.set(newState);
                break;
            case 2:
                this.motorsStates.motor2.set(newState);
                break;
            case 3:
                this.motorsStates.motor3.set(newState);
                break;
            case 4:
                this.motorsStates.motor4.set(newState);
                break;
        }
    }

    setMotorSpeed(id: number, speed: number) {
        switch (id) {
            case 1:
                this.motorsSpeeds.motor1.set(speed);
                break;
            case 2:
                this.motorsSpeeds.motor2.set(speed);
                break;
            case 3:
                this.motorsSpeeds.motor3.set(speed);
                break;
            case 4:
                this.motorsSpeeds.motor4.set(speed);
                break;
        }
    }

    emergencyStop() {
        console.log("Emergency Stop.");
        timer.stop(true);
    }
}

const drone = new Drone();

setInterval(() => {
    drone.motorsStates
        .get()
        .then((states) => socket.io.emit("motors_states", states));
    drone.motorsSpeeds
        .get()
        .then((speeds) => socket.io.emit("motors_speeds", speeds));
    drone.position
        .get()
        .then((position) => socket.io.emit("position", position));
    drone.angle.get().then((angle) => socket.io.emit("angle", angle));
}, 200);

export default drone;
