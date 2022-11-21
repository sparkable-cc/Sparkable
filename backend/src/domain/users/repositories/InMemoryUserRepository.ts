import User from '../entities/User';
import UserRepository from './UserRepository';

class InMemoryUserRepository implements UserRepository {

    users: User[];

    constructor() {
        this.users = [];
    }

    storeUser(user:User) {
        this.users.push(user);
    }

    existUsername(username:string):boolean {
        return this.exist('username', username);
    }

    existEmail(email:string):boolean {
        return this.exist('email', email);
    }

    private exist(property:string, value:string) {
        const existUser = this.users.find((user) => {
            type ObjectKey = keyof typeof user;
            const field = property as ObjectKey;
            return user[field] === value;
        })

        if(existUser) return true;
        else return false;
    }

}

export default InMemoryUserRepository;