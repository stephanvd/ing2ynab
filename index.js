var casper = require('casper').create({verbose: false, logLevel: "debug"});
var system = require('system');
var dateFormat = require('dateformat');
var convert = require('./convert');

var yesterday = (function(d) {
    d.setDate(d.getDate() - 1);
    return dateFormat(d, "dd-mm-yyyy");
})(new Date)

var date = system.env.DATE || yesterday;
var username = system.env.ING_USERNAME;
var password = system.env.ING_PASSWORD;
var transactions = [];

casper.start('https://mijn.ing.nl/internetbankieren/SesamLoginServlet', function() {
    this.echo('Visiting: ' + this.getTitle());

    this.fillSelectors('form#login', {
        '#gebruikersnaam input': username,
        '#wachtwoord input': password
    }, true);
});

casper.waitForSelector("#receivedTransactions tbody tr:nth-child(5) td:not(:empty)", function() {
    this.echo('Visiting: ' + this.getTitle());
    this.click('#showMore')
});

casper.waitForSelector("#receivedTransactions tbody tr:nth-child(14) td:not(:empty)", function() {
    this.echo('Showing more: ' + this.getTitle());
    this.capture('screenshot.png');

    transactions = transactions.concat(this.evaluate(function() {
        rows = document.querySelectorAll('#receivedTransactions > tbody tr');

        return Array.prototype.map.call(rows, function(row) {
            return Array.prototype.map.call(row.children, function(col) {
                return col.textContent;
            });
        });
    }));
})

casper.run(function() {
    this.echo("Converting...");
    var count = convert(transactions, date);
    this.echo("Converted "  + count + " transactions for " + date);
    this.echo("Finished! Closing...");
    this.exit(0);
});
