import app from "../../app";
import request from "supertest";
import { TestDataSource } from "../../data-source"

describe.only("GET /links", () => {

    beforeAll(async () => {
        await TestDataSource.initialize();
    });

    afterAll(async () => {
        await TestDataSource.destroy();
    });

    it("returns 200 and empty response when does not exist links", async () => {
        const res = await request(app).get("/links");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({links:[], total:0});
    });

});