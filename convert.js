var fs = require('fs');

module.exports = function(casper, transactions) {
  var data = "Date,Payee,Category,Memo,Outflow,Inflow\n";

  transactions = Array.prototype.filter.call(transactions, function(row) {
    if (row.length < 2) return false;
    return !Array.prototype.some.call(row, function(col) {
      var matcher = /Dit is een reservering/;
      return matcher.test(col.textContent);
    });
  });

  data += Array.prototype.join.call(
    Array.prototype.map.call(transactions, function(row) {
      return Array.prototype.join.call([
        wrap(formatDate(row[0].textContent)),
        wrap(description(row[1].innerHTML)[0].replace('Naam: ', '')),
        null,
        wrap(description(row[1].innerHTML)[1]),
        wrap(outflow(row[3].textContent)),
        wrap(inflow(row[3].textContent))
      ], ',')
    }),
    '\n'
  );

  casper.echo("Writing to ynab.csv");

  fs.write('ynab.csv', data, 'w');

  return transactions.length;
};

var description = function(txt) {
  var regex = /<div[^>]*>([^<]*)<\/div>/g,
    matches = [],
    match = regex.exec(txt);

  while (match != null) {
      matches.push(match[1]);
      match = regex.exec(txt);
  }

  return matches;
}

var formatDate = function(date) {
  return date.replace(/-/g, '/');
};

var outflow = function(amount) {
  var match = /((\d|\.|,)*)\s*Af/.exec(amount);
  if(match) return match[1];
};

var inflow = function(amount) {
  var match = /((\d|\.|,)*)\s*Bij/.exec(amount);
  if(match) return match[1];
};

var wrap = function(content) {
  if (content === undefined || content === null) {
    return '';
  }

  return '"' + content.trim() + '"';
};
