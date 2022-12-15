import app from "../../app";
import request from "supertest";
import dataSource from "../../data-source"
import { LinkEntity } from "../../contexts/links/infrastructure/persistence/entities/LinkEntity";

describe("GET /links", () => {

    const linkDto = {
        title: 'title',
        username: 'admin',
        link: 'https://www.butterfy.me/',
        image: 'https://uploads-ssl.webflow.com/5fe2721ea6fb441f47d88866/5fe2726881e6e52053a0217c_Butterfy_Logo-p-500.png',
        categories: 'environment'
    }

    beforeAll(async () => {
        await dataSource.initialize();
    });

    afterEach(async () => {
        const repository = dataSource.getRepository(LinkEntity);
        await repository.clear();
    });

    it("returns 200 and empty response when does not exist links", async () => {
        const res = await request(app).get("/links");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({links:[], total:0});
    });

    it("returns 200 with link when exists one", async () => {
        const repository = dataSource.getRepository(LinkEntity);

        repository.save(linkDto);

        const res = await request(app).get("/links");

        expect(res.statusCode).toEqual(200);
        expect(res.body.total).toEqual(1);
        expect(res.body.links[0].link).toEqual(linkDto.link);
        expect(res.body.links[0].hasOwnProperty('date')).toBe(true)
        expect(res.body.links[0].hasOwnProperty('uuid')).toBe(true)
    });

    it("returns 200 with multipe links when exist two", async () => {
        const repository = dataSource.getRepository(LinkEntity);
        repository.save(linkDto);
        repository.save(linkDto);

        const res = await request(app).get("/links");

        expect(res.statusCode).toEqual(200);
        expect(res.body.total).toEqual(2);
    });
});