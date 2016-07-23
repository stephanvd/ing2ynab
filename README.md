# ing2ynab

Syncs mijn.ing.nl transactions to app.youneedabudget.com

- Logs into mijn.ing.nl
- Grabs the latest transactions
- Builds a CSV
- Uploads to nYNAB

I've developed this for hourly cron syncs.

Some hardcoded assumptions:
- It picks the first budget account in the list
- It's limited to 16 transactions currently

## Installation:

```
npm install -g phantomjs-prebuilt
npm install -g casperjs
npm install
```

## Usage:

```
ING_USERNAME=user \
ING_PASSWORD=123456 \
YNAB_USERNAME=user \
YNAB_PASSWORD=123456 \
./ing2ynab
```
