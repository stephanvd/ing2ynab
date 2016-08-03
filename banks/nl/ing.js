module.exports = function(casper) {
  var ingUsername = system.env.C2Y_BANK_USERNAME;
  var ingPassword = system.env.C2Y_BANK_PASSWORD;
  var startDate = system.env.START_DATE || daysAgo(2);
  var endDate = system.env.END_DATE || daysAgo(1);

  casper.echo('Fetching transactions between ' + startDate + ' and ' + endDate);

  casper.start('https://mijn.ing.nl/internetbankieren/SesamLoginServlet', function() {
    casper.echo('Visiting: ' + this.getTitle());

    casper.fillSelectors('form#login', {
      '#gebruikersnaam input': ingUsername,
      '#wachtwoord input': ingPassword
    }, true);
  });

  casper.thenOpen('https://bankieren.mijn.ing.nl/particulier/overzichten/download/index', function() {
    var formData = casper.evaluate(function(startDate, endDate) {
      $('form.form-horizontal #downloadFormat').val('string:CSV').change();
      $('form.form-horizontal input[name="startDate"]').val(startDate).change();
      $('form.form-horizontal input[name="endDate"]').val(endDate).change();

      document.forms["downloadForm"].onsubmit = function() {
        return false;
      }

      $("#gTransactionsDownload button.btn-primary").click();

      var formData = {
        XSRF_TOKEN: $("input[name='XSRF_TOKEN']").val(),
        eas: $("input[name='eas']").val(),
        as: $("input[name='as']").val(),
        data: $("input[name='data']").val()
      };

      return formData;
    }, startDate, endDate);

    //Start the download
    casper.download(
      'https://bankieren.mijn.ing.nl/api/reporting/file/format/CSV/transaction',
      'downloadedTransactions.csv',
      'POST',
      {
        startDate: startDate,
        endDate: endDate,
        XSRF_TOKEN: formData.XSRF_TOKEN,
        eas: formData.eas,
        as: formData.as,
        data: formData.data
      }
    );

    var downloadedTransactions = fs.open('downloadedTransactions.csv', 'r');
    var line = downloadedTransactions.readLine();
    var data = "Date,Payee,Category,Memo,Outflow,Inflow\n";

    while(line) {
        var columns = line.split(/,(?=")/);

        if(columns[0] != '"Datum"') {
          data += Array.prototype.join.call(
            [
              convertDate(columns[0]),
              columns[1],
              null,
              columns[8],
              (columns[5] == '"Af"' ? columns[6] : null),
              (columns[5] == '"Bij"' ? columns[6] : null),
            ],
            ','
          )
          data += '\n'
        }

        line = downloadedTransactions.readLine();
    }
    downloadedTransactions.close();

    casper.echo("Writing to ynab.csv");
    fs.write('ynab.csv', data, 'w');
  });

  function convertDate(dateString) {
    var year = dateString.slice(1, 5),
      month = dateString.slice(5, 7),
      day = dateString.slice(7, 9);

    return '"' + Array.prototype.join.call([year, month, day], '-') + '"';
  }

  function daysAgo(days) {
    var date = new Date();
    var yesterday = date.setDate(date.getDate() - days);
    return date.getDate() +  "-" + (date.getMonth() + 1) +  "-" + date.getFullYear()
  }
}
