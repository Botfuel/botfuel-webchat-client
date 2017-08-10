const express = require('express');
const sslRedirect = require('heroku-ssl-redirect');
const compression = require('compression');

const app = express();
app.use(compression());

if (process.env.NODE_ENV === 'production') {
  app.use(sslRedirect());
}

app.use(express.static('build'));
app.listen(process.env.PORT || 7000);
