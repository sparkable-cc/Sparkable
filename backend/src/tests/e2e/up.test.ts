import app from "../../app";
import request from "supertest";

describe("GET /", () => {

    it("returns 200 when the server is up", async () => {
        const req = await request(app).get("/");

        expect(req.statusCode).toEqual(200);
    });

});