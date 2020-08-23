# Sends GET and POST requests with a sane callback

**request-service** provides GET and POST request methods, logs errors, and calls a callback with Error, Data and StatusCode.  

Homepage: https://github.com/popovmp/request-service

## Synopsis

Make a **POST** request

```javascript
const requestService = require("@popovmp/request-service");

const hostname = "example.org";
const path     = "/post";
const data     = {"foo": "bar"};
const headers  = {"Answer": 42};

requestService.post(hostname, path, data, headers,
    request_ready);
```

Make a **GET** request

```javascript
const hostname = "example.org";
const path     = "/get?foo=bar";
const headers  = {"Answer": 42};

requestService.get(hostname, path, headers,
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
 * @param {string} hostname
 * @param {string} path
 * @param {any} data
 * @param {OutgoingHttpHeaders} headers
 * @param {ResponseCallback} [callback] callback(error, data, responseCode)
 */
function post(hostname, path, data, headers, callback)
````

```javascript
/**
 * Sends a GET request.
 *
 * @param {string} hostname
 * @param {string} path
 * @param {OutgoingHttpHeaders} headers
 * @param {ResponseCallback} [callback] callback(error, data, responseCode)
 */
function get(hostname, path, headers, callback)
````

Where:

```javascript
/**
 * @typedef {function} ResponseCallback
 *
 * @param {null|string} error
 * @param {string|null} data
 * @param {number} [code] - status code
 */
function request_ready(err, data, status)
````

## License

`request-service` is free for use and modification. No responsibilities for damages of any kind.

Copyright (c) 2020 Miroslav Popov
