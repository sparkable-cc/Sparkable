import { UserDto } from '../../../domain/models/UserDto';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { UserEntity } from '../entities/UserEntity';
import { DataSource } from 'typeorm';

export class UserRepositoryPG implements UserRepository {
    private userRepository;

    constructor(dataSource: DataSource) {
        this.userRepository = dataSource.getRepository(UserEntity);
    }

    storeUser(user:UserDto) {
        this.userRepository.save(user);
    }

    async findUser(field:string, value:string):Promise<UserDto | null> {
        return await this.userRepository.findOne({
            where:{ [field]: value }
        });
   }
}