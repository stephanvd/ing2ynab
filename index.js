var fs = require('fs');
var system = require('system');
var casper = require('casper').create({
  viewportSize: { width: 1280, height: 800 },
  verbose: false,
  logLevel: "debug"
});

var ynabUsername = system.env.C2Y_YNAB_USERNAME;
var ynabPassword = system.env.C2Y_YNAB_PASSWORD;
var bank = system.env.C2Y_BANK || 'nl/ing';

casper.echo('Fetching transactions from ' + bank)
require('banks/' + bank)(casper);

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
