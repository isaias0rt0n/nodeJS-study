const { request, response } = require('express');
const express = require('express');

const app = express();

app.get('/project', (request, response) => {
  return response.send('ola');
});

app.listen(3333);