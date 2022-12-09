import { UserDto } from "./UserDto";
import { MandatoryFieldEmptyException } from '../exceptions/MandatoryFieldEmptyException';
import bcrypt from 'bcrypt';

export class User implements UserDto {
    email:string;
    username:string;
    password:string;

    private readonly salt = 10;

    constructor(email:string, username:string, password:string) {
        if (!email || !username || !password) {
            throw new MandatoryFieldEmptyException;
        }

        this.email = email;
        this.username = username;
        this.password = bcrypt.hashSync(password, this.salt);
    }

    public static factory(userDto:UserDto): User {
        return new User(
            userDto.email,
            userDto.username,
            userDto.password
        );
    }

}