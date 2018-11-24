const express = require('express');
const postits = require('./postits.js');
const jwt = require('jsonwebtoken');
const users = require('../users/users.js');
const Joi = require('joi');
const router = express.Router();
const loggedUserId = token => {
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

  return decodedId;
}

router.get('/', (req, res) => {
  try {
    const token = req.headers['x-access-token'];

    if (!token) {
      throw new TokenError('Sem permissão.', 500);
    }

    jwt.verify(token, process.env.SECRET, function(error, decoded) {
      if (error) {
        throw new TokenError('Falha ao autenticar token.', 500);
      }
    });

    res.send(postits);
  } catch(e) {
    console.log(e.code)
    res.status(e.code).send(e.message);
  }
});

router.get('/:id', (req, res) => {
  try {
    const postit = findPostit(req.params.id);
    const token = req.headers['x-access-token'];

    if (!token) {
      throw new TokenError('Sem permissão.', 500);
    }

    jwt.verify(token, process.env.SECRET, function(error, decoded) {
      if (error) {
        throw new TokenError('Falha ao autenticar token.', 500);
      }
    });

    res.send(postit);
  } catch(e) {
    res.status(e.code).send(e.message);
  }
});

router.post('/', (req, res) => {
  const id = Math.max(...postits.map(postit => postit.id)) + 1;
  const token = req.headers['x-access-token'];
  const newPostit = {
    id,
    title: req.body.title,
    description: req.body.description
  };

  try {

    if (!token) {
      throw new TokenError('Sem permissão.', 500);
    }

    jwt.verify(token, process.env.SECRET, function(error, decoded) {
      if (error) {
        throw new TokenError('Falha ao autenticar token.', 500);
      }
    });

    validatesRequest(req.body);
    postits.push(newPostit);
    setsRelantionship(newPostit.id, token);
    res.send(newPostit);
  } catch(e) {
    res.status(e.code).send(e.message);
  }
});

router.put('/:id', (req, res) => {
  try {
    const postit = findPostit(req.params.id);
    const token = req.headers['x-access-token'];
    let updatedPostit;

    if (!token) {
      throw new TokenError('Sem permissão.', 500);
    }

    jwt.verify(token, process.env.SECRET, function(error, decoded) {
      if (error) {
        throw new TokenError('Falha ao autenticar token.', 500);
      }
    });

    validatesRequest(req.body);
    updatedPostit = Object.assign(postit, req.body);
    res.send(updatedPostit);
  } catch(e) {
    res.status(e.code).send(e.message);
  }
});

router.delete('/:id', (req, res) => {
  try {
    const postit = findPostit(req.params.id);
    const postitPosition = postits.indexOf(postit);
    const token = req.headers['x-access-token'];

    if (!token) {
      throw new TokenError('Sem permissão.', 500);
    }

    jwt.verify(token, process.env.SECRET, function(error, decoded) {
      if (error) {
        throw new TokenError('Falha ao autenticar token.', 500);
      }
    });

    unsetsRelationship(req.params.id, token);
    postits.splice(postitPosition, 1);
    res.send(postit);
  } catch(e) {
    res.status(e.code).send(e.message);
  }
});

function findPostit(id) {
  const foundPostit = postits.find(postit => postit.id === parseInt(id));

  if (!foundPostit) {
    throw new PostitError(`Não foi possível encontrar o postit de ID ${id}.`, 400);
  }

  return foundPostit;
}

function findUser(id) {
  const foundUser = users.find(user => user.id === parseInt(id));

  if (!foundUser) {
    throw new PostitError(`Não foi possível encontrar o postit de ID ${id}.`, 400);
  }

  return foundUser;
}

function validatesRequest(params) {
  const schema = {
    title: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
  }
  const validation = Joi.validate(params, schema);

  if (validation.error) {
    throw new PostitError(validation.error.details[0].message, 404);
  }
}

function PostitError(message, code) {
  this.message = message;
  this.code = code;
};

function UserError(message, code) {
  this.message = message;
  this.code = code;
};

function TokenError(message, code) {
  this.message = message;
  this.code = code;
};

function setsRelantionship(postitId, token) {
  const user = findUser(loggedUserId(token));
  const postit = findPostit(postitId);

  user.postits.push(postit);
}

function unsetsRelationship(postitId, token) {
  const user = findUser(loggedUserId(token));
  const postit = findPostit(postitId);
  const index = postits.indexOf(postit);

  user.postits.splice(index, 1);
}

module.exports = router;
