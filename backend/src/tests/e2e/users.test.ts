import app from "../../app";
import request from "supertest";
import dataSource from "../../data-source"
import { UserEntity } from "../../contexts/users/infrastructure/persistence/entities/UserEntity";

describe("POST /user", () => {

    beforeAll(async () => {
        await dataSource.initialize();
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    afterEach(async () => {
        const repository = dataSource.getRepository(UserEntity);
        await repository.clear();
    });

    it("returns 400 when the mandatory field is empty", async () => {
        const req = await request(app)
        .post("/user")
        .send({
            email: "",
            username: "admin",
            password: "password"
        });

        expect(req.statusCode).toEqual(400);
    });

    it("returns 201 when the user is created", async () => {
        const req = await request(app)
        .post("/user")
        .send({
            email: "admin@butterfy.me",
            username: "admin",
            password: "password"
        });

        expect(req.statusCode).toEqual(201);
    });

    it("returns 403 when one unique field exists with the same value", async () => {
        let req = await request(app)
        .post("/user")
        .send({
            email: "admin@butterfy.me",
            username: "admin",
            password: "password"
        });

        req = await request(app)
        .post("/user")
        .send({
            email: "admin@butterfy.me",
            username: "admin",
            password: "password"
        });
        expect(req.statusCode).toEqual(403);
    });

});