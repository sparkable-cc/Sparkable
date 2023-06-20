import { AuthDto } from "../../domain/models/AuthDto";
import { UserDto } from "../../domain/models/UserDto";
import { AuthService } from "../../domain/services/AuthService";
import jwt, { Secret } from 'jsonwebtoken';

export class AuthServiceJWT implements AuthService {

  async getToken(user:UserDto):Promise<AuthDto> {
    const SECRET_KEY: Secret = process.env.SECRET_KEY || '';
    const token = await jwt.sign(
      { _id: user.uuid, name: user.username },
      SECRET_KEY,
      { expiresIn: '2 days' }
    );

    const date = new Date();
    date.setDate(date.getDate() + 2);
    return {
      access_token: token,
      expires_in: date,
      token_type: 'Bearer'
    }
  }
}