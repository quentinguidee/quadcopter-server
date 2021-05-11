var Serial = require("serialport");
const { drone } = require("./drone");
const socket = require("./socket");

var serial = {
    connection: undefined,
};

function handleMessage(message) {
    if (message.length === 1) return;
    if (message[0] !== "#") return;

    const category = message[1];

    if (category === "L") {
        // Leds
        const led = message[2];
        const status = message[3] === "1" ? "on" : "off";
        drone.leds[`led${led}`] = status;
        socket.io.emit("leds", drone.leds);
        return;
    }

    if (category === "D") {
        const command = message[2];
        switch (command) {
            case "0":
                drone.state = "off";
                break;
            case "1":
                drone.state = "on";
                break;
        }
        socket.io.emit("state", drone.state);
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
            socket.io.emit("logs", data);
            handleMessage(data);
        });

        serial.connection.on("open", () => {
            console.log("Serial communication opened.");
            drone.state = "off";
            socket.io.emit("state", "off");
            resolve();
        });

        serial.connection.on("error", (err) => {
            console.error(err);
            reject(err);
        });
    });
}

function serialWrite(message) {
    return async (req, res, next) => {
        serial.connection.write(`$${message}\n`, (err) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ message: err.message });
            }

            next();
        });
    };
}

module.exports = { serial, connect, serialWrite };
