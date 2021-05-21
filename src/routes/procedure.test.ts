import request from "supertest";
import app from "../app";

it("GET /procedures/motors-test", () => {
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

it("POST /procedures/motors-test/start", () => {
    return request(app)
        .post("/procedures/motors-test/start")
        .expect(200)
        .expect("Content-Type", /json/);
});

it("POST /procedures/motors-test/stop", () => {
    return request(app)
        .post("/procedures/motors-test/stop")
        .expect(200)
        .expect("Content-Type", /json/);
});

it("POST /procedures/motors-test/reset", () => {
    return request(app)
        .post("/procedures/motors-test/reset")
        .expect(500)
        .expect("Content-Type", /json/);
});
