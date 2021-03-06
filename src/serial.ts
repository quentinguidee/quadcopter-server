import Serial from "serialport";
import drone from "./database/drone";
import socket from "./socket";

const serial = {
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
            drone.setMotorSpeed(motor, Number.parseInt(speed));
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
            const pos = parseCoordinates(message);
            drone.setPosition(pos.x, pos.y, pos.z);
            return;
        }

        if (command === "A") {
            // Angle
            const angle = parseCoordinates(message);
            drone.setAngle(angle.x, angle.y, angle.z);
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

export function connect() {
    serial.connection = new Serial("/dev/tty.usbmodem14201", {
        baudRate: 38400,
    });

    return new Promise((resolve, reject) => {
        const parser = serial.connection.pipe(
            // @ts-ignore
            new Serial.parsers.Readline()
        );

        parser.on("data", (data) => {
            handleMessage(data);
        });

        serial.connection.on("open", () => {
            const message = "Serial communication opened.";
            drone.inSetup();
            resolve({ message });
        });

        serial.connection.on("close", (data) => {
            console.log("Serial communication closed.");
            serial.connection = undefined;
            drone.telemetryLost();
            drone.disconnected();
        });

        serial.connection.on("error", (err) => {
            serial.connection = undefined;
            reject({ error: true, message: err.message });
        });
    });
}

export function serialWrite(message) {
    return new Promise((resolve, reject) => {
        if (!serial.connection) {
            reject({ error: true, message: "Port not opened" });
        }

        serial.connection.write(`$${message}\n`, (err) => {
            if (err) {
                reject({ error: true, message: err.message });
            }
            resolve({ message: "ok" });
        });
    });
}

export default serial;
