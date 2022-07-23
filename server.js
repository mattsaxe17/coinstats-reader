const express = require('express');
const bodyParser = require('body-parser');
const { getPortfolio } = require('./service');
const port = 8080;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/portfolio/:code', (req, res) => {
  getPortfolio(`https://coinstats.app/p/${req.params.code}`)
    .then(portfolio => {
      res.status(200).send(portfolio);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

app.listen(port, () => {
  console.log('App listening on port ', port);
});
