const express = require('express');
const users = require('./users.js');
const app = express();
const Joi = require('joi');
// const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('Hello world!'));

app.get('/api/users', (req, res) => res.send(users));

app.get('/api/users/:id', (req, res) => {
  const foundUser = users.find(user => user.id === parseInt(req.params.id));
  if (!foundUser) {
    return res.status(404).send('Deu merda');
  }

  res.send(foundUser);
});

app.post('/api/users', (req, res) => {
  const id = Math.max(...users.map(user => user.id)) + 1;
  const newUser = {
    id,
    name: req.body.name,
    email: req.body.email
  };
  const schema = {
    name: Joi.string().required().min(3),
    email: Joi.string().required()
  };
  const validation = Joi.validate(req.body, schema);

  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }

  users.push(newUser);
  res.send(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const foundUser = users.find(user => user.id === parseInt(req.params.id));

  if (!foundUser) {
    return res.status(404).send('Deu merda');
  }

  const schema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().min(3).required(),
  }
  const validation = Joi.validate(req.body, schema);

  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }

  foundUser.name = req.body.name;
  foundUser.email = req.body.email;

  res.send(foundUser);
});

app.delete('/api/users/:id', (req, res) => {
  const foundUser = users.find(user => user.id === parseInt(req.params.id));

  if (!foundUser) {
    return res.status(404).send('Não foi possível encontrar o usuário');
  }

  users.splice(users.indexOf(foundUser), 1);
  // users.delete(...);
  res.send(foundUser);
});

app.listen(3000, () => console.log('Ouvindo na porta 3000...'));
