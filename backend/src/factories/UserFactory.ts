import { UserEntity } from "../contexts/users/infrastructure/persistence/entities/UserEntity";
import { v4 as uuidv4 } from 'uuid';
import dataSource from "../data-source";
import { User } from "../contexts/users/domain/models/User";
import { UserRole } from "../contexts/users/domain/models/UserRole";

export default class UserFactory {

  private static readonly userDto = {
    id: 0,
    uuid:'uuid',
    email: 'email',
    username: 'username',
    password: 'password',
    stage: 1,
    role: UserRole.USER
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

    const userDto = { ...this.userDto };
    userDto.uuid = uuidv4();
    if (params?.email) userDto.email = params?.email;
    if (params?.password) userDto.password = params?.password;
    if (params?.username) userDto.username = params?.username;
    if (params?.stage) userDto.stage = params?.stage;

    const user = User.factory(userDto);
    const userEntity = userRepository.create(user.toDto());

    return await userRepository.manager.save(userEntity);
  }

  public static async signIn(request:any, app:any, email:string, password:string) {
    return await request(app).post('/signin').send({
      email: email,
      password: password
    });
  }

}