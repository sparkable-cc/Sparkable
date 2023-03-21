import { MandatoryFieldEmptyException } from '../exceptions/MandatoryFieldEmptyException';
import { ShortPasswordException } from '../exceptions/ShortPasswordException';
import { UserDto } from './UserDto';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

export class User {
  private email: string;
  private username: string;
  private password: string;
  private uuid: string;
  private stage: number;

  constructor(email: string, username: string, password: string, uuid:string = uuidv4()) {
    if (!email || !username || !password) {
      throw new MandatoryFieldEmptyException();
    }

    this.setPassword(password);
    this.email = email;
    this.username = username;
    this.uuid = uuid;
    this.stage = 1;
  }

  public setPassword(password:string) {
    if (password.length < 8) {
      throw new ShortPasswordException();
    }
    dotenv.config();
    this.password = bcrypt.hashSync(password, Number(process.env.SALT));
  }

  public get getEmail(): string {
    return this.email;
  }

  public get getUsername(): string {
    return this.username;
  }

  public get getUuid(): string {
    return this.uuid;
  }

  public static factory(userDto: UserDto): User {
    return new User(userDto.email, userDto.username, userDto.password, userDto.uuid);
  }

  public toDto(): UserDto {
    return {
      id: 0,
      uuid: this.uuid,
      email: this.email,
      username: this.username,
      password: this.password,
      stage: this.stage
    };
  }
}
