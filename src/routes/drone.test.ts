import request from "supertest";
import app from "../app";

import Serial from "@serialport/stream";
import MockBinding from "@serialport/binding-mock";
import serial from "../serial";
import drone from "../drone";

Serial.Binding = MockBinding;

afterEach(() => {
    MockBinding.reset();
    serial.connection = undefined;
});

function plugUSB() {
    MockBinding.createPort("/dev/tty.usbmodem14201", {
        echo: true,
        record: true,
    });
}

function connectUSB() {
    serial.connection = new Serial("/dev/tty.usbmodem14201", {
        baudRate: 38400,
    });
}

describe("POST /drone/connect", () => {
    it("should connect", () => {
        plugUSB();
        return request(app)
            .post("/drone/connect")
            .expect(200)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeUndefined();
                expect(message).toBe("Connected");
            });
    });

    it("should fail because not plugged in", () => {
        return request(app)
            .post("/drone/connect")
            .expect(500)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeTruthy();
                expect(message).toBe(
                    "Port does not exist - please call MockBinding.createPort('/dev/tty.usbmodem14201') first"
                );
            });
    });

    it("should fail because already connected", () => {
        plugUSB();
        connectUSB();
        return request(app)
            .post("/drone/connect")
            .expect(500)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeTruthy();
                expect(message).toBe("Port is locked cannot open");
            });
    });
});

describe("POST /drone/on", () => {
    it("should turn on", () => {
        plugUSB();
        connectUSB();
        return request(app)
            .post("/drone/on")
            .expect(200)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeUndefined();
                expect(message).toBe("Send startup command");
            });
    });

    it("should fail because not plugged in", () => {
        return request(app)
            .post("/drone/on")
            .expect(500)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeTruthy();
                expect(message).toBe("Port not opened");
            });
    });

    it("should fail because not connected", () => {
        plugUSB();
        return request(app)
            .post("/drone/on")
            .expect(500)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeTruthy();
                expect(message).toBe("Port not opened");
            });
    });
});

describe("POST /drone/off", () => {
    it("should turn off", () => {
        plugUSB();
        connectUSB();
        return request(app)
            .post("/drone/off")
            .expect(200)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeUndefined();
                expect(message).toBe("Send shutdown command");
            });
    });

    it("should fail because not plugged in", () => {
        return request(app)
            .post("/drone/off")
            .expect(500)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeTruthy();
                expect(message).toBe("Port not opened");
            });
    });

    it("should fail because not connected", () => {
        plugUSB();
        return request(app)
            .post("/drone/off")
            .expect(500)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeTruthy();
                expect(message).toBe("Port not opened");
            });
    });
});

describe("POST /motorstest/on", () => {
    it("should start motorstest", () => {
        plugUSB();
        connectUSB();
        return request(app)
            .post("/drone/motorstest/on")
            .expect(200)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeUndefined();
                expect(message).toBe("Send start motors test command");
            });
    });

    it("should fail because not plugged in", () => {
        return request(app)
            .post("/drone/motorstest/on")
            .expect(500)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeTruthy();
                expect(message).toBe("Port not opened");
            });
    });

    it("should fail because not connected", () => {
        plugUSB();
        return request(app)
            .post("/drone/motorstest/on")
            .expect(500)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeTruthy();
                expect(message).toBe("Port not opened");
            });
    });
});

describe("POST /motorstest/off", () => {
    it("should start motorstest", () => {
        plugUSB();
        connectUSB();
        return request(app)
            .post("/drone/motorstest/off")
            .expect(200)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeUndefined();
                expect(message).toBe("Send stop motors test command");
            });
    });

    it("should fail because not plugged in", () => {
        return request(app)
            .post("/drone/motorstest/off")
            .expect(500)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeTruthy();
                expect(message).toBe("Port not opened");
            });
    });

    it("should fail because not connected", () => {
        plugUSB();
        return request(app)
            .post("/drone/motorstest/off")
            .expect(500)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeTruthy();
                expect(message).toBe("Port not opened");
            });
    });
});
