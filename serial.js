var Serial = require("serialport");

var serial = new Serial("/dev/tty.usbmodem14201", {
    baudRate: 38400,
});

serial.on("open", () => {
    console.log("Serial communication opened.");
});

const parser = serial.pipe(new Serial.parsers.Readline());

parser.on("data", (data) => console.log(data));

module.exports = serial;
