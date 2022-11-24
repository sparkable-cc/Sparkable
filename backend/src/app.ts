import express, { Express, Request, Response } from 'express';

import { CreateUserAction } from './contexts/users/actions/CreateUserAction';
import { EmailExistsException } from './contexts/users/domain/exceptions/EmailExistsException';
import { MandatoryFieldEmptyException } from './contexts/users/domain/exceptions/MandatoryFieldEmptyException';
import { UsernameExistsException } from './contexts/users/domain/exceptions/UsernameExistsException';
import { UserRepositoryPG } from './contexts/users/infrastructure/persistence/repositories/UserRepositoryPG';

const app: Express = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req: Request, res: Response) => {
  res.send('Butterfy Server');
});

app.post('/user', async (req: Request, res: Response) => {
  const createUserAction = new CreateUserAction(new UserRepositoryPG());
  createUserAction.execute(req.body.email, req.body.username, req.body.password)
  .then(() => {
    res.status(201);
    res.send('User created');
  })
  .catch((error) => {
    switch (error.constructor) {
      case MandatoryFieldEmptyException:
        res.status(400);
        res.send('Bad request');
        break;
      case UsernameExistsException || EmailExistsException:
        res.status(403);
        res.send('User exist');
        break;
      default:
        console.log('Failed to do something async with an unspecified error: ', error);
        return res.send(500);
    }
  });
});

export default app;