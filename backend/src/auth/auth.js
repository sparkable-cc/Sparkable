const express = require('express');
const app = express();

const port = process.env.PORT || 8080;

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-tucv1mg8c4yexyas.us.auth0.com/.well-known/jwks.json',
  }),
  audience: 'http://localhost:5000',
  issuer: 'https://dev-tucv1mg8c4yexyas.us.auth0.com/',
  algorithms: ['RS256'],
});

app.use(jwtCheck);

app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});

app.listen(port);
