let socket = require("./socket");

const DISCONNECTED = "disconnected";
const ON = "on";
const OFF = "off";
const MOTORS_TEST = "motorstest";

var drone = {
    // Variables
    state: DISCONNECTED,
    accelerometer: DISCONNECTED,
    position: {
        x: 0,
        y: 0,
        z: 0,
    },
    angle: {
        x: 0,
        y: 0,
        z: 0,
    },
    leds: {
        led1: DISCONNECTED,
        led2: DISCONNECTED,
        led3: DISCONNECTED,
        led4: DISCONNECTED,
    },
    motors: {
        motor1: {
            state: DISCONNECTED,
            speed: undefined,
        },
        motor2: {
            state: DISCONNECTED,
            speed: undefined,
        },
        motor3: {
            state: DISCONNECTED,
            speed: undefined,
        },
        motor4: {
            state: DISCONNECTED,
            speed: undefined,
        },
    },

    // Methods
    telemetryLost: telemetryLost,

    on: () => setState(ON),
    off: () => setState(OFF),
    disconnected: () => setState(DISCONNECTED),
    startMotorsTest: () => setState(MOTORS_TEST),
    stopMotorsTest: () => setState(ON),

    accelerometerOn: () => setAccelerometerState(ON),
    accelerometerDisconnected: () => setAccelerometerState(DISCONNECTED),

    setPosition: setPosition,
    setAngle: setAngle,

    ledOn: (id) => setLedState(id, ON),
    ledOff: (id) => setLedState(id, OFF),
    ledDisconnected: (id) => setLedState(id, DISCONNECTED),

    motorOn: (id) => setMotorState(id, ON),
    motorOff: (id) => setMotorState(id, OFF),
    motorDisconnected: (id) => setMotorState(id, DISCONNECTED),
    motorSpeedChanged: (id, speed) => setMotorSpeed(id, speed),
};

function setState(state) {
    drone.state = state;
    socket.io.emit("state", drone.state);
}

function setAccelerometerState(state) {
    drone.accelerometer = state;
    socket.io.emit("accelerometer", drone.accelerometer);
}

function setPosition(position) {
    drone.position = position;
}

function setAngle(angle) {
    drone.angle = angle;
}

function setLedState(id, state) {
    drone.leds[`led${id}`] = state;
    socket.io.emit("leds", drone.leds);
}

function setMotorState(id, state) {
    const motor = drone.motors[`motor${id}`];
    motor.state = state;
    if (state === "disconnected") {
        motor.speed = undefined;
    }
}

function setMotorSpeed(id, speed) {
    drone.motors[`motor${id}`].speed = speed;
}

function telemetryLost() {
    drone.disconnected();
    setAccelerometerState(DISCONNECTED);
    drone.setPosition({ x: 0, y: 0, z: 0 });
    drone.setAngle({ x: 0, y: 0, z: 0 });
    drone.ledDisconnected(1);
    drone.ledDisconnected(2);
    drone.ledDisconnected(3);
    drone.ledDisconnected(4);
    drone.motorDisconnected(1);
    drone.motorDisconnected(2);
    drone.motorDisconnected(3);
    drone.motorDisconnected(4);
}

setInterval(() => {
    socket.io.emit("motors", drone.motors);
    socket.io.emit("position", drone.position);
    socket.io.emit("angle", drone.angle);
}, 200);

module.exports = drone;
