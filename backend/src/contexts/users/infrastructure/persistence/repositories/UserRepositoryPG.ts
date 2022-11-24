import { UserDto } from '../../../domain/models/UserDto';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { AppDataSource } from "../../../../../../data-source"
import { UserEntity } from '../entities/UserEntity'

export class UserRepositoryPG implements UserRepository {
    private userRepository;

    constructor() {
        this.userRepository = AppDataSource.getRepository(UserEntity)
    }

    storeUser(user:UserDto) {
        // const userEntity = new UserEntity();
        // userEntity.email = user.email;
        // userEntity.username = user.username;
        // userEntity.password = user.password;
        this.userRepository.save(user);
        console.log("User has been saved")
    }

    async findUser(field:string, value:string):Promise<UserDto | null> {
        return await this.userRepository.findOne({
            where:{ [field]: value }
        });
   }
}