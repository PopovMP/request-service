# A wrapper around `request` with a sane callback

**request-service** provides GET and POST request methods, logs errors and calls a callback with Error, Data and StatusCode.  

Homepage: https://github.com/popovmp/request-service

## Synopsis

```javascript
const requestService = require("@popovmp/request-service");

const url     = "https://exmaple.com/post";
const form    = {answer:  42};
const headers = {Sender: "John"};


requestService.post(url, form, headers,
    requestService_post_callback);

function requestService_post_callback(err, data, status) {
    if (err) {
        console.error("Error: " + err);
    } else {
        console.log(data);
    }
    console.log("Status: " + status);
}

````

## Installation

```
npm install @popovmp/request-service
```

## ToDo

Since `request` is deprecated ( https://github.com/request/request/issues/3142 ),
we have to write own request functionality.

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
 * @param {Object} form
 * @param {Object} headers
 * @param {ResponseCallback} [callback] callback(error, data, responseCode)
 */
function post(url, form, headers, callback)
````

```javascript
/**
 * Sends a GET request.
 *
 * @param {string} url
 * @param {Object} query
 * @param {Object} headers
 * @param {ResponseCallback} callback
 */
function get(url, query, headers, callback)
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
````

## License

`request-service` is free for use and modification. No responsibilities for damages of any kind.

Copyright (c) 2020 Miroslav Popov
