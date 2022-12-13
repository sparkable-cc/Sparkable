import express, { Express, Request, Response } from 'express';
import { AppDataSource, TestDataSource } from './data-source';
import dotenv from 'dotenv';
import cors from 'cors';

import { CreateUserAction } from './contexts/users/actions/CreateUserAction';
import { EmailExistsException } from './contexts/users/domain/exceptions/EmailExistsException';
import { MandatoryFieldEmptyException } from './contexts/users/domain/exceptions/MandatoryFieldEmptyException';
import { UsernameExistsException } from './contexts/users/domain/exceptions/UsernameExistsException';
import { UserRepositoryPG } from './contexts/users/infrastructure/persistence/repositories/UserRepositoryPG';

import { GetAllLinksAction } from './contexts/links/actions/GetAllLinksAction';
import { LinkRepositoryPG } from './contexts/links/infrastructure/persistence/repositories/LinkRepositoryPG';

let dataSource = AppDataSource;
if (process.env.NODE_ENV === 'test') dataSource = TestDataSource;

const app: Express = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

dotenv.config();
app.use(cors({origin: process.env.CLIENT}));

app.get('/', (req: Request, res: Response) => {
  res.send('Butterfy API');
});

app.post('/user', async (req: Request, res: Response) => {
  const createUserAction = new CreateUserAction(new UserRepositoryPG(dataSource));
  createUserAction.execute(req.body.email, req.body.username, req.body.password)
  .then(() => {
    res.status(201);
    res.send({message:'User created!'});
  })
  .catch((error) => {
    switch (error.constructor) {
      case MandatoryFieldEmptyException:
        res.status(400);
        res.send({message:'Bad request'});
        break;
      case UsernameExistsException || EmailExistsException:
        res.status(403);
        res.send({message:'User exist!'});
        break;
      default:
        console.log('Failed to do something async with an unspecified error: ', error);
        return res.send(500);
    }
  });
});

app.get('/links', async (req: Request, res: Response) => {
  const getAllLinksAction = new GetAllLinksAction(new LinkRepositoryPG(dataSource));
  getAllLinksAction.execute()
  .then((result) => {
    res.status(200);
    res.send({links:result[0], total:result[1]});
  })
  .catch((error) => {
      console.log('Failed to do something async with an unspecified error: ', error);
      return res.send(500);
  });
});


export default app;