var drone = {
    state: "disconnected",
};

function setState(state) {
    drone.state = state;
}

function getState() {
    return drone.state;
}

module.exports = { drone, setState, getState };
