import { DataSource } from "typeorm"
import "reflect-metadata";
import dotenv from 'dotenv';

const AppDataSource = new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "user",
    password: "password",
    database: "db",
    synchronize: true,
    logging: true,
    entities: [__dirname + '/contexts/**/infrastructure/persistence/entities/*.{ts,js}'],
    subscribers: [],
    migrations: []
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
    subscribers: [],
    migrations: []
})

dotenv.config();

let dataSource = AppDataSource;
if (process.env.NODE_ENV === 'test') dataSource = TestDataSource;

export default dataSource;