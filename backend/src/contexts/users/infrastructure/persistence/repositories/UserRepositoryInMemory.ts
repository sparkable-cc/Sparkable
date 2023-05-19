import { User } from '../../../domain/models/User';
import { UserDto } from '../../../domain/models/UserDto';
import { UserRepository } from '../../../domain/repositories/UserRepository';

export class UserRepositoryInMemory implements UserRepository {

  public users: UserDto[];

  constructor() {
    this.users = [];
  }

  async storeUser(user:User) {
    const userExist = await this.findUser({uuid: user.getUuid});

    if (userExist) {
      if (this.users.length === 1) {
        this.users = [];
        this.users.push(user.toDto());
      }
    } else {
      this.users.push(user.toDto());
    }
  }

  findUser(options:Object): Promise<UserDto | null> {
    const keys = Object.keys(options);
    type ObjectKey = keyof typeof options;
    const propertyOptions = keys[0] as ObjectKey;

    const user = this.users.find((user) => {
      type ObjectKey = keyof typeof user;
      const propertyUser = keys[0] as ObjectKey;
      return String(user[propertyUser]) === String(options[propertyOptions]);
    })

    if (user) return new Promise((resolve, rejects) => resolve(user));
    else return new Promise((resolve, rejects) => resolve(null));
  }

  getAllUsers(options: Object): Promise<[UserDto[], number]> {
    return new Promise((resolve, rejects) => resolve([
      this.users,
      this.users.length
    ]));
  }

  createWithOne(userUuid:string) {
    this.users = [{
      id:0,
      uuid: userUuid,
      email: 'email',
      username: 'username',
      password: 'password',
      stage: 1
    }];
  }
}
