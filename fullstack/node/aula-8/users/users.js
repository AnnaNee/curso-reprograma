const postits = require('../postits/postits.js');

const users = [
  {
    id: 1,
    name: 'Anna Flávia',
    email: 'annaflaviac@me.com',
    password: 'r3pr0gr@m@2018',
    roles: ['admin'],
    postits: [postits[0], postits[1]],
  },
  {
    id: 2,
    name: 'Ana Paula',
    email: 'ana.paula@reprograma.com.br',
    password: 'r3pr0gr@m@2017',
    roles: [],
    postits: [postits[2]],
  },
  {
    id: 3,
    name: 'Silvia',
    email: 'silvia@reprograma.com.br',
    password: 'r3pr0gr@m@2016',
    roles: [],
  }
];

module.exports = users;
