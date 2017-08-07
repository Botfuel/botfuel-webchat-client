const express = require('express');
const sslRedirect = require('heroku-ssl-redirect');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(sslRedirect());
}

app.use(express.static('build'));
app.listen(process.env.PORT || 7000);
