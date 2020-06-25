
Specify your username and password in semWeb.test.js before running tests.

Run devnet for testing
```npm run-script test```

Cannot run test 2 times, because after first it will create new validator and blockchain will stop.
Remove devnet folder after each test.

# SemWeb Javascript SDK

This library aims to providing javascript utilities for Semux client-side applications.

Visit [issues](https://github.com/speedrunner911/sem-web/issues) page to see planned features or propose a feature request.

## Table of Contents

- [Install](#install)
- [Maintainers](#maintainers)

## Install

```
git clone https://github.com/speedrunner911/sem-web
```

## Getting Started

**Node.js**

```javascript
const SemWeb = require('./index.js')

// create an API client
const semWeb = new SemWeb(
  "http://localhost:5171/v2.4.0",
  "privateKey",
  "user", // username
  "pass"  // password
)
// get latest block
semWeb.sem.getBlock('latest').then(console.log)
```


## Maintainers

[@speedrunner](https://github.com/speedrunner911/).



