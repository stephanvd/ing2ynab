# ing2ynab

Syncs mijn.ing.nl transactions to app.youneedabudget.com. Logs into mijn.ing.nl, grabs the latest transactions, converts the CSV and uploads to nYNAB fully automated.

- It picks the first budget account in the list
- Date range defaults to yesterday and two days ago
- Only ING NL supported for now. The logic is split for convenient forking.

## Installation:

```
npm install -g phantomjs-prebuilt
npm install -g casperjs
npm install
```

## Usage:

```
C2Y_BANK=nl/ing \
C2Y_BANK_USERNAME=user \
C2Y_BANK_PASSWORD=123456 \
C2Y_YNAB_USERNAME=user \
C2Y_YNAB_PASSWORD=123456 \
START_DATE=15-11-2000 \
END_DATE=16-11-2000 \
./ing2ynab
```
