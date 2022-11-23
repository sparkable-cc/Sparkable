import User from '../../../domain/models/User';
import UserRepository from '../../../domain/repositories/UserRepository';
import { AppDataSource } from "../../../../../data-source"
import { UserEntity } from '../entities/UserEntity'

export class UserRepositoryPG implements UserRepository {
    private userRepository;

    constructor() {
        this.userRepository = AppDataSource.getRepository(UserEntity)
    }

    storeUser(user:User) {
        const userEntity = new UserEntity();
        userEntity.email = user.email;
        userEntity.username = user.username;
        userEntity.password = user.password;
        this.userRepository.save(user);
        console.log("User has been saved")
    }

    existUsername(username:string):boolean {
        return this.exist('username', username);
    }

    existEmail(email:string):boolean {
        return this.exist('email', email);
    }

    private exist(property:string, value:string):boolean {
        const user = await this.userRepository.findOneBy({
            [property]: value,
        });
        console.log("User from the db: ", user);

        //user.then return true
        // lo otro false?

        if(user) return true;
        else return false;
    }

}