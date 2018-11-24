// Exportando um módulo

const mostraMensagem = name => `Olá, ${name}`;

function diga(name) {
  console.log(mostraMensagem(name));
}

module.exports = diga;
