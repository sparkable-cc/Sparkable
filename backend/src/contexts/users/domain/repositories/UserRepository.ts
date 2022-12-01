import { User } from '../models/User'
import { UserDto } from '../models/UserDto';

export interface UserRepository {
    storeUser: (user:User) => void,
    findUser: (field:string, value:string) => Promise<UserDto | null>
}