import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
 token: string | JwtPayload;
 userUuid: string;
}

const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    const SECRET_KEY: Secret = process.env.SECRET_KEY || '';
    const decoded = await jwt.verify(token, SECRET_KEY);
    (req as CustomRequest).token = decoded;
    (req as CustomRequest).userUuid = Object(decoded)['_id'];
    next();
  } catch (err) {
    res.status(401).send('Please authenticate');
  }
};

export default checkJwt;