import { AuthDto } from "../models/AuthDto";

export interface AuthService {
    getToken: () => Promise<AuthDto>,
}