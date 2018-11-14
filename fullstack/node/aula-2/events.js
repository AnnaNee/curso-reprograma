const EventEmitter = require('events');
const event = new EventEmitter();

// Como enviar e ouvir um evento
event.on('mensagemEnviada', function() {
  console.log('Ouvi um evento!');
});
event.emit('mensagemEnviada'); // nomes de eventos sempre deverão indicar que algo aconteceu

// Enviado dados adicionais a partir de um emitter
event.on('mensagemEnviada', function(coisas) {
  console.log('Ouvi esse evento!', coisas.nomeDoEvento);
});
event.emit('mensagemEnviada', { nomeDoEvento: 'mensagemEnviada'});

// A ordem em que um evento é emitido importa!
event.emit('mensagemEnviada', { nomeDoEvento: 'mensagemEnviada' });
event.on('mensagemEnviada', function(data) {
  console.log('Ouvi esse evento!', data.nomeDoEvento);
});
