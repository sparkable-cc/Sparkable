import { UserDto } from "./UserDto";

export class User implements UserDto {
    email:string;
    username:string;
    password:string;

    constructor(email:string, username:string, password:string) {
       this.email = email;
       this.username = username;
       this.password = password;
    }

    public static factory(userDto:UserDto): User {
        return new User(
            userDto.email,
            userDto.username,
            userDto.password
        );
    }

}