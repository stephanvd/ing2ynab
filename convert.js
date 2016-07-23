var fs = require('fs');

module.exports = function(transactions, date) {
  var data = "Date,Payee,Category,Memo,Outflow,Inflow\n";

  data += Array.prototype.join.call(
    Array.prototype.map.call(transactions, function(tx) {
      return Array.prototype.join.call([
        wrap(tx[0]),
        wrap(tx[1]),
        null,
        null,
        wrap(outflow(tx[3])),
        wrap(inflow(tx[3]))
      ], ',')
    }),
    '\n'
  )

  fs.write('ynab.csv', data, 'w');

  return transactions.length - 1;
};

var outflow = function(amount) {
  var match = /(\d*,\d{2})\s*Af/.exec(amount);
  if(match) return match[1];
}

var inflow = function(amount) {
  var match = /(\d*,\d{2})\s*Bij/.exec(amount);
  if(match) return match[1];
}

var wrap = function(content) {
  if (content === undefined || content === null) {
    return '';
  }

  return '"' + content + '"';
}
