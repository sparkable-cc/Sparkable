import app from "../../app";
import request from "supertest";
import dataSource from "../../data-source"
import { LinkEntity } from "../../contexts/links/infrastructure/persistence/entities/LinkEntity";
import LinkFactory from "../../factories/LinkFactory"
import CategoryFactory from "../../factories/CategoryFactory"
import { CategoryEntity } from "../../contexts/links/infrastructure/persistence/entities/CategoryEntity";

describe("GET /categories", () => {

    beforeAll(async () => {
        await dataSource.initialize();
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    afterEach(async () => {
        const categoryRepository = dataSource.getRepository(CategoryEntity);
        await categoryRepository.delete({});
    });

    it("returns 200 and empty response when does not exist links", async () => {
        const res = await request(app).get("/categories");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({categories:[], total:0});
    });

    it("returns 200 with multipe categories when exist two", async () => {
        const categoryNameOne = 'Cat 1';
        const categoryNameTwo = 'Cat 2';
        await CategoryFactory.create(categoryNameOne);
        await CategoryFactory.create(categoryNameTwo);

        const res = await request(app).get("/categories");

        expect(res.statusCode).toEqual(200);
        expect(res.body.total).toEqual(2);
        expect(res.body.categories[0].name).toEqual(categoryNameOne);
        expect(res.body.categories[1].name).toEqual(categoryNameTwo);
    });

});