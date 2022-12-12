import { UserDto } from '../../../domain/models/UserDto';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UserEntity } from '../entities/UserEntity';
import { DataSource } from 'typeorm';
import { User } from '../../../domain/models/User';

export class UserRepositoryPG implements UserRepository {
    private userRepository;

    constructor(dataSource: DataSource) {
        this.userRepository = dataSource.getRepository(UserEntity);
    }

    storeUser(user:User) {
        this.userRepository.save(user.toDto());
    }

    async findUser(field:string, value:string):Promise<UserDto | null> {
        return await this.userRepository.findOne({
            where:{ [field]: value }
        });
   }
}