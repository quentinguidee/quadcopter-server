import request from "supertest";
import app from "../app";

import Serial from "@serialport/stream";
import MockBinding from "@serialport/binding-mock";
import serial from "../serial";

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

                expect(serial.connection.binding.lastWrite).toStrictEqual(
                    Buffer.from("$D1\n")
                );
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

                expect(serial.connection.binding.lastWrite).toStrictEqual(
                    Buffer.from("$D0\n")
                );
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

describe("POST /drone/liftoff", () => {
    it("should liftoff", () => {
        plugUSB();
        connectUSB();
        return request(app)
            .post("/drone/liftoff")
            .expect(200)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeUndefined();
                expect(message).toBe("Send liftoff command");

                expect(serial.connection.binding.lastWrite).toStrictEqual(
                    Buffer.from("$D2\n")
                );
            });
    });

    it("should fail because not plugged in", () => {
        return request(app)
            .post("/drone/liftoff")
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
            .post("/drone/liftoff")
            .expect(500)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeTruthy();
                expect(message).toBe("Port not opened");
            });
    });
});

describe("POST /drone/landing", () => {
    it("should turn off", () => {
        plugUSB();
        connectUSB();
        return request(app)
            .post("/drone/landing")
            .expect(200)
            .expect("Content-Type", /json/)
            .then((res) => {
                const { error, message } = res.body;
                expect(error).toBeUndefined();
                expect(message).toBe("Send landing command");

                expect(serial.connection.binding.lastWrite).toStrictEqual(
                    Buffer.from("$D3\n")
                );
            });
    });

    it("should fail because not plugged in", () => {
        return request(app)
            .post("/drone/landing")
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
            .post("/drone/landing")
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

                expect(serial.connection.binding.lastWrite).toStrictEqual(
                    Buffer.from("$D4\n")
                );
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

                expect(serial.connection.binding.lastWrite).toStrictEqual(
                    Buffer.from("$D5\n")
                );
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
