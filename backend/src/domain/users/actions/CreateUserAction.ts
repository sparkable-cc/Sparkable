import { MandatoryFieldEmptyException } from '../exceptions/MandatoryFieldEmptyException';
import UserRepository from '../repositories/UserRepository';
import User from '../entities/User'
import { UsernameExistsException } from '../exceptions/UsernameExistsException';
import { EmailExistsException } from '../exceptions/EmailExistsException';

class CreateUserAction {
    userRepository:UserRepository;

    constructor(userRepository:UserRepository) {
        this.userRepository = userRepository;
    }

    execute(email:string, username:string, password:string) {
        if (!email || !username || !password) {
            throw new MandatoryFieldEmptyException;
        }

        if (this.userRepository.existUsername(username)) {
            throw new UsernameExistsException;
        }

        if (this.userRepository.existEmail(email)) {
            throw new EmailExistsException;
        }

        const user = new User(email, username, password);
        this.userRepository.storeUser(user);
    }
}

export default CreateUserAction;