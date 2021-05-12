let socket = require("./socket");

var drone = {
    // Variables
    state: "disconnected",
    leds: {
        led1: "disconnected",
        led2: "disconnected",
        led3: "disconnected",
        led4: "disconnected",
    },

    // Methods
    on: () => setState("on"),
    off: () => setState("off"),
    disconnected: () => setState("disconnected"),

    ledOn: (id) => setLedState(id, "on"),
    ledOff: (id) => setLedState(id, "off"),
    ledDisconnected: (id) => setLedState(id, "disconnected"),
};

function setState(state) {
    drone.state = state;
    socket.io.emit("state", drone.state);
}

function setLedState(id, state) {
    drone.leds[`led${id}`] = state;
    socket.io.emit("leds", drone.leds);
}

module.exports = drone;
