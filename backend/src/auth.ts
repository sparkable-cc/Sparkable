import { auth } from 'express-oauth2-jwt-bearer';

const checkJwt = async(req:any, res:any, next:any) => {
    if (process.env.NODE_ENV === 'test') {
      if (!req.headers.authorization) {
        return res.status(401).json({ error: 'No credentials sent!' });
      }
      next();
    }
    else
      return auth({
        audience: process.env.AUTH0_AUDIENCE,
        issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
        tokenSigningAlg: 'RS256',
      })
  };


export default checkJwt;