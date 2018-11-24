const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('./users.js');
const router = express.Router();
const Joi = require('joi');

router.use(express.json());

router.get('/', (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    let decodedId;

    if (!token) {
      throw new TokenError('Sem permissão.', 500);
    }

    jwt.verify(token, process.env.SECRET, function(error, decoded) {
      if (error) {
        throw new TokenError('Falha ao autenticar token.', 500);
      }

      decodedId = decoded.id;
    });

    hasPermission(decodedId);
    res.send(users);
  } catch(e) {
    res.status(e.code).send(e.message);
  }
});

router.get('/:id', (req, res) => {
  try {
    const user = findUser(req.params.id);
    const token = req.headers['x-access-token'];
    let decodedId;

    if (!token) {
      throw new TokenError('Sem permissão.', 500);
    }

    jwt.verify(token, process.env.SECRET, function(error, decoded) {
      if (error) {
        throw new TokenError('Falha ao autenticar token.', 500);
      }

      decodedId = decoded.id;
    });

    hasPermission(decodedId);
    res.send(user);
  } catch(e) {
    res.status(e.code).send(e.message);
  }
});

router.post('/', (req, res) => {
  const token = req.headers['x-access-token'];
  const id = Math.max(...users.map(users => users.id)) + 1;
  const newUser = {
    id,
    name: req.body.name,
    email: req.body.email
  };
  let decodedId;

  try {
    if (!token) {
      throw new TokenError('Sem permissão.', 500);
    }

    jwt.verify(token, process.env.SECRET, function(error, decoded) {
      if (error) {
        throw new TokenError('Falha ao autenticar token.', 500);
      }

      decodedId = decoded.id;
    });

    hasPermission(decodedId);
    validatesRequest(req.body);
    users.push(newUser);
    res.send(newUser);
  } catch(e) {
    res.status(e.code).send(e.message);
  }
});

router.put('/:id', (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    const user = findUser(req.params.id);
    let decodedId;

    if (!token) {
      throw new TokenError('Sem permissão.', 500);
    }

    jwt.verify(token, process.env.SECRET, function(error, decoded) {
      if (error) {
        throw new TokenError('Falha ao autenticar token.', 500);
      }

      decodedId = decoded.id;
    });

    hasPermission(decodedId);
    validatesRequest(req.body);
    Object.assign(user, req.body);
    res.send(user);
  } catch(e) {
    res.status(e.code).send(e.message);
  }
});

router.delete('/:id', (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    const user = findUser(req.params.id);
    const index = users.indexOf(user);
    let decodedId;

    if (!token) {
      throw new TokenError('Sem permissão.', 500);
    }

    jwt.verify(token, process.env.SECRET, function(error, decoded) {
      if (error) {
        throw new TokenError('Falha ao autenticar token.', 500);
      }

      decodedId = decoded.id;
    });

    hasPermission(decodedId);
    validateToken(token);
    users.splice(index, 1);
    res.send(user);
  } catch(e) {
    res.status(e.code).send(e.message);
  }
});

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
    password: Joi.string().min(3).required(),
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

function TokenError(message, code) {
  this.message = message;
  this.code = code;
};

function hasPermission(userId) {
  const user = findUser(userId);

  if (!user.roles.includes('admin')) {
    throw new UserError('Usuário sem permissão.', 500);
  }

  return true;
}

module.exports = router;
