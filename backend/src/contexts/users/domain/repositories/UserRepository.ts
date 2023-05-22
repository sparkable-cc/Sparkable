import { User } from '../models/User'
import { UserDto } from '../models/UserDto';

export interface UserRepository {
    storeUser: (user:User) => void;
    findUser: (options:Object) => Promise<UserDto | null>;
    getAllUsers: (options:Object) => Promise<[UserDto[], number]>;
}