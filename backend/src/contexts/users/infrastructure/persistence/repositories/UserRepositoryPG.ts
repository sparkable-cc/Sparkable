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

  async storeUser(user:User) {
    const userExist = await this.findUser({uuid: user.getUuid});

    if (userExist) {
      await this.userRepository.update({id: userExist.id}, {stage: user.getStage});
    } else  {
      await this.userRepository.save(user.toDto());
    }
  }

  async findUser(options:Object):Promise<UserDto | null> {
    const keys = Object.keys(options);
    type ObjectKey = keyof typeof options;
    const property = keys[0] as ObjectKey;

    return await this.userRepository.findOne({
        where:{ [property]: options[property] }
    });
  }

}