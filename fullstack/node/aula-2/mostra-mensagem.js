// Registrando um listener para um evento emitido em outro arquivo
const EnviaMensagem = require('./envia-mensagem.js'); // algo de errado aqui?
const enviaMensagem = new EnviaMensagem();

enviaMensagem.on('mensagemEnviada', mensagem => {
  console.log(`A mensagem "${mensagem}" foi enviada com sucesso!`)
});
enviaMensagem.enviar('Olá, mundo!');
