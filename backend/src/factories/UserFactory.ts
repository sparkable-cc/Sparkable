import { UserDto } from "../contexts/users/domain/models/UserDto";
import { UserEntity } from "../contexts/users/infrastructure/persistence/entities/UserEntity";
import { v4 as uuidv4 } from 'uuid';
import dataSource from "../data-source";
import { User } from "../contexts/users/domain/models/User";

export default class UserFactory {

  private static readonly userDto = {
    id: 0,
    uuid:'uuid',
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

  public static async signIn(user:UserDto) {
    return {
      body : {
        access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFZVjVibk9QSXpyTnlvTXlqRDJ0biJ9.eyJpc3MiOiJodHRwczovL2Rldi10dWN2MW1nOGM0eWV4eWFzLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhZzliV2pKbFliUjU3c2RyQzJnMkM3c0tJRElOaDFJc0BjbGllbnRzIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiaWF0IjoxNjg1OTc3NDg2LCJleHAiOjE2ODYwNjM4ODYsImF6cCI6ImFnOWJXakpsWWJSNTdzZHJDMmcyQzdzS0lESU5oMUlzIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.mxMWachFI3qc8kOyunWrbNmZDMwyF4GARu8a_vqoWRxRv2wH7m88aakiVDjXL_pvyak8aNrSLWcbOZzhi5iNTvpaFepyGwhDfeXalLYezL-O7HyIsors_sCrQTmT-_DnvcoKfxGY5-mfK90Q3RRBHWfDJvdh_CX0HAqqIoY000FWOcffpHin7a48YSvtxynwRPCy16Es_JRerZLMa7vSomU15GwLBqktm4hz087WO8rY3S2N73vOo4fvqz_kUuxe9SAL6ILob5LAYgD1WoPd0eOjNNB33165-WdfYABII0jZVkt8Ac3LEfhRCIFub6J7ZE0vJ09WsZP71b5LL-BzWQ',
        uuid: user.uuid
      }
    }
    // return await request(app).post('/signin').send({
    //   email: email,
    //   password: password
    // });
  }

}