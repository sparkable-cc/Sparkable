import dotenv from 'dotenv';
import jwksClient from 'jwks-rsa';
import app from './app';
import { AppDataSource } from './data-source';

dotenv.config();

const port = process.env.PORT;

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
