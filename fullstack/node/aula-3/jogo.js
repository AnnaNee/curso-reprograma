const readline = require('readline');
const io = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const numeroRandomico = Math.floor(Math.random() * 100);

function recomecar() {
  const numeroRandomico = Math.floor(Math.random() * 100);

  io.question('Gostaria de jogar novamente? ', resposta => {
    if (resposta == 'sim') {
      comecarJogo(numeroRandomico);
    } else {
      io.close();
    }
  });
}

function tenteDenovo(numero) {
  io.question('Tente denovo: ', resposta => {
    checarResposta(resposta, numero);
  });
}

function checarResposta(resposta, numero) {
  if (resposta == numero) {
    console.log('Parabéns, você acertou!');
    recomecar();
  } else if (resposta < numero) {
    console.log('Precisa ser um número maior!');
    tenteDenovo(numero);
  } else {
    console.log('Precisa ser um número menor!');
    tenteDenovo(numero);
  }
}

function comecarJogo(numero) {
  io.question('Pensei em um número. Qual é? ', resposta => {
    checarResposta(resposta, numero);
  });
};

comecarJogo(numeroRandomico);
