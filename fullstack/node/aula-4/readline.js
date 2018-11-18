const readline = require('readline');
const io = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

io.question('Qual seu nome? ', nome => {
  console.log('Koé', nome);
  io.close();
});
