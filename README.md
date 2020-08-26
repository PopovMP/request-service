# Sends GET and POST requests with a sane callback

**request-service** provides GET and POST request methods.
It sends the request, logs errors, and calls a callback, when it is ready.  

Homepage: https://github.com/popovmp/request-service

## Synopsis

Make a **POST** request

```javascript
const requestService = require("@popovmp/request-service");

const url     = "https://example.com/post?foo=bar";
const headers = {"Username": "John Dowe"};
const data    = {"answer": 42}; // Can be anything

requestService.post(url, data, headers,
    request_ready);
```

Make a **GET** request

```javascript
const url     = "https://example.com/get?foo=bar";
const headers = {"Username": "John Dowe"};

requestService.get(url, headers,
    request_ready);
```

The `request-service` accepts equal callback for both GET and POST requests.

```javascript
function request_ready(err, data, status) {
    if (err) {
        console.error("Error: " + err);
    }

    console.log(data);
    console.log("Status: " + status);
}
````

## Default Content-Type header

**request-service** sets default Content-Type header for the **POST** requests depending on the `data` type.

  - Buffer => `Content-Type: application/octet-stream`
  - Object => `Content-Type: application/json`
  - String => `Content-Type: application/x-www-form-urlencoded`
  - Any => `Content-Type: text/plain`

## Installation

```
npm install @popovmp/request-service
```

## Logging errors

**request-service** uses the **micro-logger** ( https://npmjs.com/package/@popovmp/micro-logger ) package for logging errors.

When **micro-logger** is not initialized, it logs in the console.
If you want to log the errors in a log file, init **micro-logger** in your `index.js` as follows;

```javascript
const logger = require("micro-logger").init("./logs/log.txt");
```

## Methods

**request-service** exports two methods:

```javascript
/**
 * Sends a POST request.
 *
 * @param {string} url
 * @param {any} data
 * @param {OutgoingHttpHeaders} headers
 * @param {ResponseCallback} [callback] callback(error, data, responseCode)
 */
function post(url, data, headers, callback)
````

```javascript
/**
 * Sends a GET request.
 *
 * @param {string} url
 * @param {OutgoingHttpHeaders} headers
 * @param {ResponseCallback} [callback] callback(error, data, responseCode)
 */
function get(url, headers, callback)
````

Where:

```javascript
/**
 * @typedef {function} ResponseCallback
 *
 * @param {null|string} error
 * @param {Buffer|string|null} data
 * @param {number} [code] - status code
 */
function request_ready(err, data, status)
````

## License

`request-service` is free for use and modification. No responsibilities for damages of any kind.

Copyright (c) 2020 Miroslav Popov
