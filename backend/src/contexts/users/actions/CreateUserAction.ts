import { MandatoryFieldEmptyException } from '../domain/exceptions/MandatoryFieldEmptyException';
import { UserRepository } from '../domain/repositories/UserRepository';
import { User } from '../domain/models/User'
import { UsernameExistsException } from '../domain/exceptions/UsernameExistsException';
import { EmailExistsException } from '../domain/exceptions/EmailExistsException';

export class CreateUserAction {
    userRepository:UserRepository;

    constructor(userRepository:UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(email:string, username:string, password:string) {
        this.checkParametersAreNotEmpty(email, username, password);
        await this.checkUsernameIsNotUsed(username);
        await this.checkEmailIsNotUsed(email);

        const user = new User(email, username, password);
        this.userRepository.storeUser(user);
    }

    private checkParametersAreNotEmpty(email: string, username: string, password: string) {
        if (!email || !username || !password) {
            throw new MandatoryFieldEmptyException;
        }
    }

    private async checkUsernameIsNotUsed(username: string) {
        const user = await this.userRepository.findUser('username', username);
        if (user)
            throw new UsernameExistsException;
    }

    private async checkEmailIsNotUsed(email: string) {
        const user = await this.userRepository.findUser('email', email);
        if (user)
            throw new EmailExistsException;
    }
}