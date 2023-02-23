export default class UserFactory {

  public static async create(
    request:any,
    app:any,
    email:string,
    password:string,
    username?:string
  ) {
    return await request(app).post('/user').send({
      email: email,
      username: username || 'admin',
      password: password,
    });
  }

  public static async signIn(request:any, app:any, email:string, password:string) {
    return await request(app).post('/signin').send({
      email: email,
      password: password
    });
  }

}