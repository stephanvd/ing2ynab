# ING converter for nYNAB

- [x] Logs into mijn.ing.nl
- [x] Grabs transactions
- [x] Filters on date
- [x] Builds a CSV
- [x] Uploads to nYNAB

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
DATE=22-07-2016 \
npm start
```
