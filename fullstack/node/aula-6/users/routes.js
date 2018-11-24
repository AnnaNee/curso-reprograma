const express = require('express');
const users = require('./users.js');
const router = express.Router();
const Joi = require('joi');

router.use(express.json());

router.get('/', (req, res) => res.send(users));

router.get('/:id', (req, res) => {
  try {
    const user = findUser(req.params.id);

    res.send(user);
  } catch(e) {
    res.status(e.code).send(e.message);
  }
});

router.post('/', (req, res) => {
  const id = Math.max(...users.map(users => users.id)) + 1;
  const newUser = {
    id,
    name: req.body.name,
    email: req.body.email
  };

  try {
    validatesRequest(req.body);
    users.push(newUser);
    res.send(newUser);
  } catch(e) {
    res.status(e.code).send(e.message);
  }
});

router.put('/:id', (req, res) => {
  try {
    const user = findUser(req.params.id);

    validatesRequest(req.body);
    Object.assign(user, req.body);
    res.send(user);
  } catch(e) {
    res.status(e.code).send(e.message);
  }
});

router.delete('/:id', (req, res) => {
  try {
    const user = findUser(req.params.id);
    const index = users.indexOf(user);

    users.splice(index, 1);
    res.send(user);
  } catch(e) {
    res.status(e.code).send(e.message);
  }
});


// const schema = {
//   title: Joi.string().min(3).required(),
//   description: Joi.string().min(3).required(),
// }
// const validation = Joi.validate(params, schema);
//
// if (validation.error) {
//   throw new PostitError(validation.error.details[0].message, 404);
// }

function findUser(id) {
  const foundUser = users.find(user => user.id === parseInt(id));

  if (!foundUser) {
    throw new UserError(`Não foi possível encontrar o usuário de ID ${id}.`, 400);
  }

  return foundUser;
}

function validatesRequest(params) {
  const schema = {
    name: Joi.string().min(3).required(),
    email: Joi.string().min(3).required(),
  }
  const validation = Joi.validate(params, schema);

  if (validation.error) {
    throw new UserError(validation.error.details[0].message, 404);
  }
}

function UserError(message, code) {
  this.message = message;
  this.code = code;
};

module.exports = router;
