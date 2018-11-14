// Registrando um listener para um evento emitido em outro arquivo
const enviaMensagem = require('./envia-mensagem.js'); // algo de errado aqui?
const mensagem = new enviaMensagem();

mensagem.on('mensagemEnviada', mensagem => {
  console.log(`A mensagem "${mensagem}" foi enviada com sucesso!`)
});
mensagem.enviar('Olá, mundo!');
