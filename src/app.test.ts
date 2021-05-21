import request from "supertest";
import app from "./app";

it("should run", () => {
    request(app)
        .get("/")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
            expect(res.body).toEqual("Hello, World!");
        });
});
