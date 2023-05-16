import { UserDto } from "../contexts/users/domain/models/UserDto";
import { UserEntity } from "../contexts/users/infrastructure/persistence/entities/UserEntity";
import { v4 as uuidv4 } from 'uuid';
import dataSource from "../data-source";

export default class UserFactory {

  private static readonly userDto = {
    uuid: '',
    email: 'email',
    username: 'username',
    password: 'password',
    stage: 1
  };

  public static async create(
    email?:string,
    password?:string,
    username?:string
  ) {
    const userRepository = dataSource.getRepository(UserEntity);
    const user = userRepository.create({ ...this.userDto });

    user.uuid = uuidv4();
    if (email) user.email = email;
    if (password) user.password = password;
    if (username) user.username = username;

    return await userRepository.manager.save(user);
  }

  public static async signIn(request:any, app:any, email:string, password:string) {
    return await request(app).post('/signin').send({
      email: email,
      password: password
    });
  }

}