import app from "../../app";
import request from "supertest";
import dataSource from "../../data-source"
import { LinkEntity } from "../../contexts/links/infrastructure/persistence/entities/LinkEntity";
import LinkFactory from "../../factories/LinkFactory"
import CategoryFactory from "../../factories/CategoryFactory"
import { CategoryEntity } from "../../contexts/links/infrastructure/persistence/entities/CategoryEntity";

describe("GET /links", () => {

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

    it("returns 200 and empty response when does not exist links", async () => {
        const res = await request(app).get("/links");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({links:[], total:0});
    });

    it("returns 200 with link when exists one", async () => {
        const linkDto = await LinkFactory.create();

        const res = await request(app).get("/links");

        expect(res.statusCode).toEqual(200);
        expect(res.body.total).toEqual(1);
        expect(res.body.links[0].link).toEqual(linkDto.link);
        expect(res.body.links[0].hasOwnProperty('date')).toBe(true)
        expect(res.body.links[0].hasOwnProperty('uuid')).toBe(true)
    });

    it("returns 200 with multipe links when exist two", async () => {
        await LinkFactory.create();
        await LinkFactory.create();

        const res = await request(app).get("/links");

        expect(res.statusCode).toEqual(200);
        expect(res.body.total).toEqual(2);
    });

    it("returns 200 sorted randomly by default", async () => {
        const totalLinks = 20;
        await LinkFactory.createX(totalLinks);

        const res = await request(app).get("/links");

        expect(res.statusCode).toEqual(200);
        expect(res.body.total).toEqual(totalLinks);
        const maxId = Math.max(...res.body.links.map((links: { id: any; }) => links.id));
        expect(res.body.links[0].id).toBeLessThanOrEqual(maxId);
    });

    it("returns 200 sorted by newest first", async () => {
        await LinkFactory.create();
        await LinkFactory.create();

        const res = await request(app).get("/links?sort=-date");

        expect(res.statusCode).toEqual(200);
        expect(res.body.links[0].id).toBeGreaterThan(res.body.links[1].id);
    });

    it("returns 200 returns empty filtering for something does not exist", async () => {
        const category = await CategoryFactory.create('Environment');
        await LinkFactory.create([category]);

        const res = await request(app).get("/links?categories=technology");

        expect(res.statusCode).toEqual(200);
        expect(res.body.total).toEqual(0);
    });

    it("returns 200 filtering for something does exist", async () => {
        const slug = 'environment';
        const category = await CategoryFactory.create('Environment', slug);
        await LinkFactory.create([category]);

        const res = await request(app).get("/links?categories=" + slug);

        expect(res.statusCode).toEqual(200);
        expect(res.body.total).toEqual(1);
        expect(res.body.links[0].categories[0].name).toEqual(category.name);
    });

    it("returns 200 sorting by date and filtering by multiple categories", async () => {
        const category1 = await CategoryFactory.create('Environment', 'env1');
        await LinkFactory.create([category1]);

        const category2 = await CategoryFactory.create('Environment2', 'env2');
        await LinkFactory.create([category2]);

        const category3 = await CategoryFactory.create('Environment3', 'env3');
        await LinkFactory.create([category3]);

        const filter = category1.slug + ',' + category3.slug;
        const res = await request(app).get("/links?categories=" + filter + "&sort=-date");

        expect(res.statusCode).toEqual(200);
        expect(res.body.total).toEqual(2);
        expect(res.body.links[0].categories[0].name).toEqual(category3.name);
        expect(res.body.links[1].categories[0].name).toEqual(category1.name);
    });

    it("returns 200 sorting randomly and filtering by multiple categories", async () => {
        const category1 = await CategoryFactory.create('Environment', 'env1');
        const category2 = await CategoryFactory.create('Environment2', 'env2');
        const category3 = await CategoryFactory.create('Environment3', 'env3');

        await LinkFactory.createX(5, [category1]);
        await LinkFactory.createX(5, [category2]);
        await LinkFactory.createX(5, [category3]);

        const filter = category1.slug + ',' + category3.slug;
        const res = await request(app).get("/links?categories=" + filter);

        expect(res.statusCode).toEqual(200);
        expect(res.body.total).toEqual(10);
        const maxId = Math.max(...res.body.links.map((links: { id: any; }) => links.id));
        expect(res.body.links[0].id).toBeLessThanOrEqual(maxId);
    });

    it("returns 200 filtering by category with multiple words", async () => {
        const slug = 'business-and-economy';
        const category1 = await CategoryFactory.create('Environment', 'env');
        const category2 = await CategoryFactory.create('Business & Economy', slug);

        await LinkFactory.createX(5, [category1]);
        await LinkFactory.createX(5, [category2]);

        const res = await request(app).get("/links?categories=" + category2.slug);

        expect(res.statusCode).toEqual(200);
        expect(res.body.total).toEqual(5);
        expect(res.body.links[0].categories[0].slug).toEqual(slug);
    });

});