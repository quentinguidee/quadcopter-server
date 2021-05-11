var drone = {
    state: "disconnected",
    leds: {
        led1: "disconnected",
        led2: "disconnected",
        led3: "disconnected",
        led4: "disconnected",
    },
};

function setState(state) {
    drone.state = state;
}

function getState() {
    return drone.state;
}

module.exports = { drone, setState, getState };
