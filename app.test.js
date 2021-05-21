const request = require("supertest");
const app = require("./app");

it("should run", () => {
    request(app)
        .get("/")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
            expect(res.body).toEqual("Hello, World!");
        });
});
