import User from '../models/User'

interface UserRepository {
    storeUser: (user:User) => void,
    existUsername: (username:string) => boolean
    existEmail: (email:string) => boolean
}

export default UserRepository;