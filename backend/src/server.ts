import dotenv from 'dotenv';
import app from './app';
import dataSource from './data-source';

dotenv.config();

const port = process.env.PORT;

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
