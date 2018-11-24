const EventEmitter = require('events');
const event = new EventEmitter();

// Como enviar e ouvir um evento
event.on('mensagemEnviada', function() {
  console.log('Ouvi um evento!');
});
event.emit('mensagemEnviada'); // nomes de eventos sempre deverão indicar que algo aconteceu

// // Enviado dados adicionais a partir de um emitter
// event.on('carroCriado', function(carro) {
//   console.log('Um novo carro foi criado:', carro.marca);
// });
// event.emit('carroCriado', { marca: 'Fiat'});

// A ordem em que um evento é emitido importa!
// event.emit('mensagemEnviada', { nomeDoEvento: 'mensagemEnviada' });
// event.on('mensagemEnviada', function(data) {
//   console.log('Ouvi esse evento!', data.nomeDoEvento);
// });
