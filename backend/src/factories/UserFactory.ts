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
    params?:{
      email?:string,
      password?:string,
      username?:string,
      stage?:number
    }
  ) {
    const userRepository = dataSource.getRepository(UserEntity);
    const user = userRepository.create({ ...this.userDto });

    user.uuid = uuidv4();
    if (params?.email) user.email = params?.email;
    if (params?.password) user.password = params?.password;
    if (params?.username) user.username = params?.username;
    if (params?.stage) user.stage = params?.stage;

    return await userRepository.manager.save(user);
  }

  public static async signIn(request:any, app:any, email:string, password:string) {
    return await request(app).post('/signin').send({
      email: email,
      password: password
    });
  }

}