import { AuthDto } from "../models/AuthDto";
import { UserDto } from "../models/UserDto";

export interface AuthService {
  getToken: (user:UserDto) => Promise<AuthDto>,
}