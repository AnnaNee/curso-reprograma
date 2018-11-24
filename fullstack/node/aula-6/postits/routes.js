const express = require('express');
const postits = require('./postits.js');
const Joi = require('joi');
const router = express.Router();

router.get('/', (req, res) => res.send(postits));

router.get('/:id', (req, res) => {
  try {
    const postit = findPostit(req.params.id);

    res.send(postit);
  } catch(e) {
    res.status(e.code).send(e.message);
  }
});

router.post('/', (req, res) => {
  const id = Math.max(...postits.map(postit => postit.id)) + 1;
  const newPostit = {
    id,
    title: req.body.title,
    description: req.body.description
  };

  try {
    validatesRequest(req.body);
    postits.push(newPostit);
    res.send(newPostit);
  } catch(e) {
    res.status(e.code).send(e.message);
  }
});

router.put('/:id', (req, res) => {
  try {
    const postit = findPostit(req.params.id);
    let updatedPostit;

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

module.exports = router;
