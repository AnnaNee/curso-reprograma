// Utilizando um módulo core do Node
const fs = require('fs');
// console.log(fs.readdirSync('./'));

// Métodos assíncronos e callbacks
// console.log(fs.readdir('./', function(err, files) {
//   if (err) {
//     console.log('Erro', err);
//   } else {
//     console.log('Result', files);
//   }
// }));
//
// // Forçando um erro no callback
console.log(fs.readdir('foo', (err, files) => {
  if (err) {
    console.log('ERRO', err.pat);
  } else {
    console.log('Result', files);
  }
}));
