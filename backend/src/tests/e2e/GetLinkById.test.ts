import app from "../../app";
import request from "supertest";
import dataSource from "../../data-source"
import { LinkEntity } from "../../contexts/links/infrastructure/persistence/entities/LinkEntity";
import LinkFactory from "../../factories/LinkFactory"
import CategoryFactory from "../../factories/CategoryFactory"
import { CategoryEntity } from "../../contexts/links/infrastructure/persistence/entities/CategoryEntity";

describe("GET /links/:id", () => {

    beforeAll(async () => {
        await dataSource.initialize();
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    afterEach(async () => {
        const linkRepository = dataSource.getRepository(LinkEntity);
        await linkRepository.delete({});

        const categoryRepository = dataSource.getRepository(CategoryEntity);
        await categoryRepository.delete({});
    });

    it("returns 400 when does not exists link", async () => {
        const res = await request(app).get("/links/1");

        expect(res.statusCode).toEqual(400);
    });

});