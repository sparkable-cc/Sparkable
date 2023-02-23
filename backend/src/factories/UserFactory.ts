import { SignInAction } from "../contexts/users/actions/SignInAction";
import { UserEntity } from "../contexts/users/infrastructure/persistence/entities/UserEntity";
import dataSource from "../data-source"

export default class UserFactory {

  public static async create(request:any, app:any, email:string, password:string) {
    return await request(app).post('/user').send({
      email: email,
      username: 'admin',
      password: password,
    });
  }

  public static async signIn(request:any, app:any, email:string, password:string) {
    return await request(app).post('/signin').send({
      password: password,
      email: email,
    });
  }

}