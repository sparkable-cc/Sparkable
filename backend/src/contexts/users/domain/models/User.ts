import bcrypt from 'bcrypt';
import { MandatoryFieldEmptyException } from '../exceptions/MandatoryFieldEmptyException';
import { ShortPasswordException } from '../exceptions/ShortPasswordException';
import { UserDto } from './UserDto';

export class User {
  private email: string;
  private username: string;
  private password: string;

  private readonly salt = 10;

  constructor(email: string, username: string, password: string) {
    if (!email || !username || !password) {
      throw new MandatoryFieldEmptyException();
    }

    if (password.length < 8) {
      throw new ShortPasswordException();
    }

    this.email = email;
    this.username = username;
    this.password = bcrypt.hashSync(password, this.salt);
  }

  public get getEmail(): string {
    return this.email;
  }

  public get getUsername(): string {
    return this.username;
  }

  public static factory(userDto: UserDto): User {
    return new User(userDto.email, userDto.username, userDto.password);
  }

  public toDto(): UserDto {
    return {
      email: this.email,
      username: this.username,
      password: this.password,
    };
  }
}
