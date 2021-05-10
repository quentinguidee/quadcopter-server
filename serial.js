var Serial = require("serialport");

var serial = {
    connection: undefined,
};

function connect() {
    serial.connection = new Serial("/dev/tty.usbmodem14201", {
        baudRate: 38400,
    });

    return new Promise((resolve, reject) => {
        const parser = serial.connection.pipe(new Serial.parsers.Readline());
        parser.on("data", (data) => console.log(data));

        serial.connection.on("open", () => {
            console.log("Serial communication opened.");
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
                res.json({ message: err.message });
            }

            next();
        });
    };
}

module.exports = { serial, connect, serialWrite };
