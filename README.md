# ING converter for nYNAB

- [x] Logs into mijn.ing.nl
- [x] Grabs transactions
- [ ] Filters on date
- [x] Builds a CSV
- [ ] Uploads to nYNAB

## Installation:

*Tested on OS X*

```
npm install -g phantomjs-prebuilt
npm install -g casperjs
npm install
```

## Usage:

`ING_USERNAME=user ING_PASSWORD=123456 DATE=22-07-2016 npm start`
