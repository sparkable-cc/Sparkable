import express, { Express, Request, Response } from 'express';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/user', (req: Request, res: Response) => {
  res.status(400);
  res.send('Bad request');
});

export default app;