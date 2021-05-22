import timer from "../timer";
import request from "supertest";
import app from "../app";

beforeEach(() => {
    timer.reset({ minus: true, minutes: 1, seconds: 0 });
});

describe("GET /procedures/motors-test", () => {
    it("should get the motors test procedure", () => {
        return request(app)
            .get("/procedures/motors-test")
            .expect(200)
            .expect("Content-Type", /json/)
            .then((res) => {
                const body = res.body;
                expect(body).toHaveProperty("procedure");
                const procedure = body.procedure;
                const properties = ["start", "stop", "events"];
                properties.forEach((prop) => {
                    expect(procedure).toHaveProperty(prop);
                });
            });
    });

    it("should fail because procedure not found", () => {
        return request(app)
            .get("/procedures/unknown")
            .expect(500)
            .expect("Content-Type", /json/)
            .then((res) => {
                const body = res.body;

                expect(body).toHaveProperty("error");
                expect(body).toHaveProperty("message");
                expect(body).not.toHaveProperty("procedure");

                const { error, message } = body;
                expect(error).toBeTruthy();
                expect(message).toBe("Procedure not found");
            });
    });
});

describe("POST /procedures/motors-test/start", () => {
    it("should start the motors test procedure", () => {
        return request(app)
            .post("/procedures/motors-test/start")
            .expect(200)
            .expect("Content-Type", /json/);
    });
});

describe("POST /procedures/motors-test/stop", () => {
    it("should stop the motors test procedure", () => {
        return request(app)
            .post("/procedures/motors-test/stop")
            .expect(200)
            .expect("Content-Type", /json/);
    });
});

describe("POST /procedures/motors-test/reset", () => {
    it("should reset the motors test procedure", () => {
        return request(app)
            .post("/procedures/motors-test/reset")
            .expect(200)
            .expect("Content-Type", /json/);
    });
});
