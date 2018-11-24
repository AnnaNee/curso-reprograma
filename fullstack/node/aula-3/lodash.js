const _ = require('lodash');

function temOItem(itens, item) {
  console.log(_.includes(itens, item));
}

module.exports = temOItem;
