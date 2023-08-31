# PERN Stack Boilerplate
Boilerplate for a React/Express/PostgreSQL app.

## Quick Start
### Development - Backend
First step: cd into the backend directory.
```bash
$ cd backend
```

Then, you need to make a `.env` file with the contents of the `.env.txt` file.
```bash
$ cp .env.txt .env
```

Now you can launch the backend by running:
```bash
$ docker compose up
```
This runs the backend server on http://localhost:5000.
Also the PgAdmin server on http://localhost:8080.

##### Migrations

To execute the migrations:
```bash
$ docker compose exec backend npm run typeorm migration:run -- -d ./dist/data-source.js
```

To revert the last migration:
```bash
$ docker compose exec backend npm run typeorm migration:revert -- -d ./dist/data-source.js
```

### Development - Frontend
First step: cd into the frontend directory.
```bash
$ cd frontend
```

Then, you need to make a `.env` file with the contents of the `.env.txt` file.
```bash
$ cp .env.txt .env
```

The frontend can be launched by running:
```bash
$ npm run dev
```
or if you use yarn
```bash
$ yarn dev
```
This runs the frontend server on http://localhost:3000. All requests will be proxied to the backend.

### Deployment
Both the frontend and backend can be deployed by running in ``/``:
```bash
$ docker compose -f docker-compose-prod.yml up
```
This runs the deployed website on http://localhost:8000.

### Doc
In **doc folder**:
- endpoints

*Boilerplate inspired in https://github.com/V-Wong/pern-stack-template*
