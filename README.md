# ing2ynab

Syncs mijn.ing.nl transactions to app.youneedabudget.com

- Logs into mijn.ing.nl
- Grabs 16 latest transactions
- Builds a CSV
- Uploads to nYNAB
- Trust YNAB to filter duplicates

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
