import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { GetAllCategoriesAction } from './contexts/links/actions/GetAllCategoriesAction';
import { GetAllLinksAction } from './contexts/links/actions/GetAllLinksAction';
import { GetLinkByIdAction } from './contexts/links/actions/GetLinkByIdAction';
import { CategoryRepositoryPG } from './contexts/links/infrastructure/persistence/repositories/CategoryRepositoryPG';
import { LinkRepositoryPG } from './contexts/links/infrastructure/persistence/repositories/LinkRepositoryPG';
import { CreateUserAction } from './contexts/users/actions/CreateUserAction';
import { SignInAction } from './contexts/users/actions/SignInAction';
import { EmailExistsException } from './contexts/users/domain/exceptions/EmailExistsException';
import { MandatoryFieldEmptyException } from './contexts/users/domain/exceptions/MandatoryFieldEmptyException';
import { ShortPasswordException } from './contexts/users/domain/exceptions/ShortPasswordException';
import { UsernameExistsException } from './contexts/users/domain/exceptions/UsernameExistsException';
import { UserNotFoundException } from './contexts/users/domain/exceptions/UserNotFoundException';
import { WrongPasswordException } from './contexts/users/domain/exceptions/WrongPasswordException';
import { UserRepositoryPG } from './contexts/users/infrastructure/persistence/repositories/UserRepositoryPG';
import dataSource from './data-source';

const app: Express = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

dotenv.config();
app.use(cors({ origin: process.env.CLIENT }));

app.get('/', (req: Request, res: Response) => {
  res.send('Butterfy API');
});

app.post('/user', async (req: Request, res: Response) => {
  const createUserAction = new CreateUserAction(
    new UserRepositoryPG(dataSource),
  );
  createUserAction
    .execute(req.body.email, req.body.username, req.body.password)
    .then(() => {
      res.status(201);
      res.send({ message: 'User created!' });
    })
    .catch((error) => {
      switch (error.constructor) {
        case MandatoryFieldEmptyException:
          res.status(400);
          res.send({ message: 'Bad request' });
          break;
        case UsernameExistsException:
        case EmailExistsException:
          res.status(403);
          res.send({ message: 'User exist!' });
          break;
        case ShortPasswordException:
          res.status(400);
          res.send({ message: 'Password is too short!' });
          break;
        default:
          console.log(
            'Failed to do something async with an unspecified error: ',
            error,
          );
          return res.send(500);
      }
    });
});

app.post('/signin', async (req: Request, res: Response) => {
  const signInAction = new SignInAction(new UserRepositoryPG(dataSource));
  signInAction
    .execute(req.body.password, req.body.username, req.body.email)
    .then(() => {
      res.status(200);
      res.send({ message: 'User signed in!' });
    })
    .catch((error) => {
      switch (error.constructor) {
        case UserNotFoundException:
        case WrongPasswordException:
          res.status(401);
          res.send({ message: 'Sign in not successful!' });
          break;
        default:
          console.log(
            'Failed to do something async with an unspecified error: ',
            error,
          );
          return res.send(500);
      }
    });
});

app.get('/links', async (req: Request, res: Response) => {
  const getAllLinksAction = new GetAllLinksAction(
    new LinkRepositoryPG(dataSource),
  );

  let page: number = 0;
  if (req.query.page) page = +req.query.page;

  getAllLinksAction
    .execute(req.query.sort as string, req.query.categories as string, page)
    .then((result) => {
      res.status(200);
      res.send({ links: result[0], total: result[1] });
    })
    .catch((error) => {
      console.log(
        'Failed to do something async with an unspecified error: ',
        error,
      );
      return res.send(500);
    });
});

app.get('/links/:id', async (req: Request, res: Response) => {
  const getLinkByIdAction = new GetLinkByIdAction(
    new LinkRepositoryPG(dataSource),
  );

  const link = await getLinkByIdAction
    .execute(+req.params.id as number)
    .catch((error: any) => {
      console.log(
        'Failed to do something async with an unspecified error: ',
        error,
      );
      return res.send(500);
    });

  if (link) {
    res.status(200);
    res.send(link);
  } else {
    res.status(400);
    res.send({ message: 'Link not exists!' });
  }
});

app.get('/categories', async (req: Request, res: Response) => {
  const getAllCategoriesAction = new GetAllCategoriesAction(
    new CategoryRepositoryPG(dataSource),
  );

  getAllCategoriesAction
    .execute()
    .then((result) => {
      res.status(200);
      res.send({ categories: result[0], total: result[1] });
    })
    .catch((error) => {
      console.log(
        'Failed to do something async with an unspecified error: ',
        error,
      );
      return res.send(500);
    });
});

export default app;
