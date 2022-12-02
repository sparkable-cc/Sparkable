import { rejects } from 'assert';
import { User } from '../../../domain/models/User';
import { UserDto } from '../../../domain/models/UserDto';
import { UserRepository } from '../../../domain/repositories/UserRepository';

export class UserRepositoryInMemory implements UserRepository {

    users: User[];

    constructor() {
        this.users = [];
    }

    storeUser(user:User) {
        this.users.push(user);
    }

    findUser(field:string, value:string): Promise<UserDto | null> {
        const user = this.users.find((user) => {
            type ObjectKey = keyof typeof user;
            const property = field as ObjectKey;
            return user[property] === value;
        })

        if (user) return new Promise((resolve, rejects) => resolve(user));
        else return new Promise((resolve, rejects) => resolve(null));
    }
}
