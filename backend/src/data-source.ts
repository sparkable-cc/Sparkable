import { DataSource } from "typeorm"
import "reflect-metadata";
import { UserEntity } from "./contexts/users/infrastructure/persistence/entities/UserEntity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "user",
    password: "password",
    database: "db",
    synchronize: true,
    logging: true,
    entities: [UserEntity],
    subscribers: [],
    migrations: [],
})
