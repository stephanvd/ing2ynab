var casper = require('casper').create({
    viewportSize: { width: 1280, height: 800 },
    verbose: false,
    logLevel: "debug"
});
var system = require('system');
var convert = require('./convert');

var ingUsername = system.env.ING_USERNAME;
var ingPassword = system.env.ING_PASSWORD;
var ynabUsername = system.env.YNAB_USERNAME;
var ynabPassword = system.env.YNAB_PASSWORD;

var transactions = [];

casper.start('https://mijn.ing.nl/internetbankieren/SesamLoginServlet', function() {
    this.echo('Visiting: ' + this.getTitle());

    this.fillSelectors('form#login', {
        '#gebruikersnaam input': ingUsername,
        '#wachtwoord input': ingPassword
    }, true);
});

casper.waitForSelector("#receivedTransactions tbody tr:nth-child(5) td:not(:empty)", function() {
    this.echo('Visiting: ' + this.getTitle());
    this.click('#showMore')
});

casper.waitForSelector("#receivedTransactions tbody tr:nth-child(14) td:not(:empty)", function() {
    this.echo('Showing more: ' + this.getTitle());
    this.capture('transactions.png');

    transactions = transactions.concat(this.evaluate(function() {
        var rows = document.querySelectorAll('#receivedTransactions > tbody tr');

        return Array.prototype.map.call(rows, function(row) {
            return Array.prototype.map.call(row.children, function(col) {
                return {textContent: col.textContent, innerHTML: col.innerHTML};
            });
        });

    }));

    this.echo("Converting...");
    var count = convert(casper, transactions);
    if(count > 0) {
        this.echo("Converted "  + count + " transactions");
    } else {
        this.echo("Nothing to upload");
        this.exit(0);
    }
});

casper.thenOpen('https://app.youneedabudget.com/users/login');

casper.waitForSelector('.login-username', function() {
    casper.sendKeys('.login-username', ynabUsername);
    casper.sendKeys('.login-password', ynabPassword);
    this.click('.users-form button.button-primary');
});

casper.waitForSelector(".budget-header-totals-amount", function() {
    this.echo("Logged in to YNAB");
    this.click('.nav-account-row');
});

casper.waitForSelector(".accounts-toolbar-file-import-transactions", function() {
    this.click('.accounts-toolbar-file-import-transactions');
});

casper.waitForSelector(".modal-import-choose-file", function() {
    this.echo("Uploading file");
    this.page.uploadFile('input[type="file"]', 'ynab.csv');
});

casper.waitForSelector(".modal-import-review", function() {
    this.click('.import-preview-select-date input')
});

casper.waitForSelector(".import-preview-select-date .ynab-select-option", function() {
    emberAction = this.evaluate(function() {
        return Array.prototype.filter.call(
            document.querySelectorAll(".import-preview-select-date .ynab-select-option"), function(x) {
                return /DD\/MM\/YYYY/.test(x.innerHTML);
            }
        )[0].dataset.emberAction;
    });

   this.mouse.click("button[data-ember-action='" + emberAction + "']");
});

casper.waitWhileSelector(".import-preview-select-date .ynab-select-option", function() {
    this.capture('import.png');
    this.click('.modal-import-review button.button-primary');
});

casper.waitForText("Import Successful", function() {
    this.echo("Import Successful");
    this.click('.modal-import-successful button.button-primary');
});

casper.waitWhileSelector(".import-preview-select-date .ynab-select-option", function() {
    this.echo("Finished!");
});

casper.run(function() {
    this.echo("Closing...");
    this.exit(0);
});
