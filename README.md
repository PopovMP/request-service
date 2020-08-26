# Sends GET and POST requests with a sane callback

**request-service** provides GET and POST request methods.

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
function request_ready(err, data) {
    if (err) {
        console.error("Error: " + err);
    }

    console.log(data);
}
````

## Installation

```
npm install @popovmp/request-service
```

## Default Content-Type header

**request-service** sets default Content-Type header for the **POST** requests depending on the `data` type.

  - Buffer => `Content-Type: application/octet-stream`
  - Object => `Content-Type: application/json`
  - String => `Content-Type: application/x-www-form-urlencoded`
  - Any => `Content-Type: text/plain`

# Callback data

**request-service** call the given callback when the request is ready.

In case of an error, the callback brings `error.message` and `null`.

When there is no error, it is called with `null` and `data`. The `data` can be `Buffer`, `Object`, `string` or `null`.

When the response has a `Content-Type: application/json` header, the callback receives `JSON.parse(data)`.

## Methods

**request-service** exports two methods:

```javascript
/**
 * Sends a POST request.
 *
 * @param {string} url
 * @param {any} data
 * @param {OutgoingHttpHeaders} headers
 * @param {ResponseCallback} callback callback(error, data)
 */
function post(url, data, headers, callback)
````

```javascript
/**
 * Sends a GET request.
 *
 * @param {string} url
 * @param {OutgoingHttpHeaders} headers
 * @param {ResponseCallback} callback callback(error, data)
 */
function get(url, headers, callback)
````

Where:

```javascript
/**
 * @typedef { function } ResponseCallback
 *
 * @param { null | string } error
 * @param { Buffer | Object | string | null } data
 */
function request_ready(err, data)
````

## License

`request-service` is free for use and modification. No responsibilities for damages of any kind.

Copyright (c) 2020 Miroslav Popov
