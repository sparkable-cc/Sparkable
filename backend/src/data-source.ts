import { DataSource } from "typeorm"
import "reflect-metadata";
import dotenv from 'dotenv';
import fs = require('fs');

dotenv.config();

let dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [__dirname + '/contexts/**/infrastructure/persistence/entities/*.{ts,js}'],
    subscribers: [],
    migrations: [__dirname + '/db/migrations/*.{ts,js}'],
    dropSchema: false
});

switch (process.env.NODE_ENV) {
    case 'prod':
        const pathSSLCert = process.env.SSL_CERT;
        if (pathSSLCert) {
            dataSource = new DataSource({
                type: "postgres",
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                synchronize: false,
                logging: true,
                entities: [__dirname + '/contexts/**/infrastructure/persistence/entities/*.{ts,js}'],
                subscribers: [],
                migrations: [__dirname + '/db/migrations/*.{ts,js}'],
                dropSchema: false,
                ssl: {ca: fs.readFileSync(pathSSLCert, 'utf-8').toString() }
            });
        }
        break;

    case 'test':
        dataSource = new DataSource({
            type: "postgres",
            host: "db",
            port: 5432,
            username: "test",
            password: "test",
            database: "test",
            synchronize: true,
            logging: false,
            entities: [__dirname + '/contexts/**/infrastructure/persistence/entities/*.{ts,js}'],
            subscribers: []
        });
        break;
}

export default dataSource;