import { AuthDto } from "../../domain/models/AuthDto";
import { AuthService } from "../../domain/services/AuthService";

export class AuthServiceAuth0 implements AuthService {

  async getToken():Promise<AuthDto> {
    const body = {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
      grant_type: "client_credentials"
    };

    const response = await fetch(
      process.env.AUTH0_ISSUER_BASE_URL + 'oauth/token',
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'content-type': 'application/json' },
      }
    );

    const jsonResponse = await response.json();
    var date = new Date();
    date.setDate(date.getDate() + 2);
    jsonResponse.expires_in = date;

    return jsonResponse;
  }
}