import { DataSource } from "typeorm"
import "reflect-metadata";
import dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: true,
    entities: [__dirname + '/contexts/**/infrastructure/persistence/entities/*.{ts,js}'],
    subscribers: [],
    migrations: [__dirname + '/db/migrations/*.{ts,js}']
})

const TestDataSource = new DataSource({
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
})

dotenv.config();

let dataSource = AppDataSource;
if (process.env.NODE_ENV === 'test') dataSource = TestDataSource;

export default dataSource;