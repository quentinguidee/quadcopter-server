var Serial = require("serialport");
const drone = require("./drone");
const socket = require("./socket");

var serial = {
    connection: undefined,
};

function parseCoordinates(message) {
    const indexX = message.indexOf("X");
    const indexY = message.indexOf("Y");
    const indexZ = message.indexOf("Z");

    return {
        x: Number.parseFloat(message.substring(indexX + 1, indexY)),
        y: Number.parseFloat(message.substring(indexY + 1, indexZ)),
        z: Number.parseFloat(message.substring(indexZ + 1)),
    };
}

function handleMessage(message) {
    if (message.length === 1) return;
    if (message[0] !== "#") return socket.io.emit("logs", message);

    const category = message[1];

    if (category === "L") {
        // Leds
        const led = message[2];
        message[3] === "1" ? drone.ledOn(led) : drone.ledOff(led);
        return;
    }

    if (category === "D") {
        // Drone
        const command = message[2];
        switch (command) {
            case "0":
                drone.off();
                break;
            case "1":
                drone.on();
                break;
            case "4":
                drone.startMotorsTest();
                break;
            case "5":
                drone.stopMotorsTest();
                break;
            case "6":
                drone.failedToSetup();
                break;
            case "7":
                drone.off();
        }
        return;
    }

    if (category === "M") {
        // Motors
        const motor = message[2];
        if (message[3] === "S") {
            // Motor speed changed
            const speed = message.substring(4);
            drone.motorSpeedChanged(motor, Number.parseInt(speed));
            return;
        }

        const command = message[3];
        switch (command) {
            case "0":
                drone.motorOff(motor);
                break;
            case "1":
                drone.motorOn(motor);
                break;
            case "2":
                drone.motorOn(motor);
                break;
            case "3":
                drone.motorFailedToSetup(motor);
                break;
        }
        return;
    }

    if (category === "A") {
        // Accelerometer
        const command = message[2];

        if (command === "P") {
            // Position
            drone.setPosition(parseCoordinates(message));
            return;
        }

        if (command === "A") {
            // Angle
            drone.setAngle(parseCoordinates(message));
            return;
        }

        switch (command) {
            case "1":
                // Startup
                drone.accelerometerOn();
                break;
            case "2":
                // Calibrated
                break;
        }
        return;
    }
}

function connect() {
    serial.connection = new Serial("/dev/tty.usbmodem14201", {
        baudRate: 38400,
    });

    return new Promise((resolve, reject) => {
        const parser = serial.connection.pipe(new Serial.parsers.Readline());
        parser.on("data", (data) => {
            console.log(data);
            handleMessage(data);
        });

        serial.connection.on("open", () => {
            console.log("Serial communication opened.");
            drone.inSetup();
            resolve();
        });

        serial.connection.on("close", (data) => {
            console.log("Serial communication closed.");
            console.log(data);
            drone.telemetryLost();
            drone.disconnected();
        });

        serial.connection.on("error", (err) => {
            console.error(err);
            reject({ error: true, message: err.message });
        });
    });
}

function serialWrite(message) {
    return new Promise((resolve, reject) => {
        serial.connection.write(`$${message}\n`, (err) => {
            if (err) {
                reject({ error: true });
            }
            resolve({ message: "ok" });
        });
    });
}

module.exports = { serial, connect, serialWrite };
