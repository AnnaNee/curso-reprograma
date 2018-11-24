const express = require('express');
const postitsRoute = require('./postits/routes.js');
const usersRoute = require('./users/routes.js');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/postits', postitsRoute);
app.use('/api/users', usersRoute);

app.listen(PORT, () => console.log(`Ouvindo na porta ${PORT}...`));
