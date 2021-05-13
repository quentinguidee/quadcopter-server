let socket = require("./socket");

const DISCONNECTED = "disconnected";
const ON = "on";
const OFF = "off";

var drone = {
    // Variables
    state: DISCONNECTED,
    accelerometer: DISCONNECTED,
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
    on: () => setState(ON),
    off: () => setState(OFF),
    disconnected: () => setState(DISCONNECTED),

    accelerometerOn: () => setAccelerometerState(ON),
    accelerometerDisconnected: () => setAccelerometerState(DISCONNECTED),

    ledOn: (id) => setLedState(id, ON),
    ledOff: (id) => setLedState(id, OFF),
    ledDisconnected: (id) => setLedState(id, DISCONNECTED),

    motorOn: (id) => setMotorState(id, ON),
    motorOff: (id) => setMotorState(id, OFF),
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

function setLedState(id, state) {
    drone.leds[`led${id}`] = state;
    socket.io.emit("leds", drone.leds);
}

function setMotorState(id, state) {
    drone.motors[`motor${id}`].state = state;
}

function setMotorSpeed(id, speed) {
    drone.motors[`motor${id}`].speed = speed;
}

setInterval(() => {
    socket.io.emit("motors", drone.motors);
}, 200);

module.exports = drone;
