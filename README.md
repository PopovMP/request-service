# Make GET and POST requests with default headers and parse the response

**request-service** provides GET and POST request methods,
 sets default headers, and pareses the response.

Homepage: https://github.com/popovmp/request-service#readme

## Synopsis

Make a **GET** request

```javascript
const url     = "https://example.com/get?foo=bar";
const headers = {"Username": "John Dowe"};

requestService.get(url, headers,
    request_ready);
```

Make a **POST** request

```javascript
const requestService = require("@popovmp/request-service");

const url     = "https://example.com/post?foo=bar";
const data    = {"answer": 42}; // Can be anything
const headers = {"Username": "John Dowe"};

requestService.post(url, data, headers,
    request_ready);
```

**POST form** request with a `Content-Type: x-www-form-urlencoded` header

```javascript
const requestService = require("@popovmp/request-service");

const url     = "https://example.com/form";
const form    = {"name": "John Dowe", "email": "john@example.com"};
const headers = {};

requestService.form(url, form, headers,
    request_ready);
```

**POST json** request with a `Content-Type: application/json` header

```javascript
const requestService = require("@popovmp/request-service");

const url     = "https://example.com/api";
const object  = {"answer": 42, "numbers": [1, 2, 3, 4]};
const headers = {};

requestService.json(url, object, headers,
    request_ready);
```

The **request-service** accepts equal callback for both GET and POST requests.

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

If, you do not provide a `Content-Type` header, **request-service** sets a default `Content-Type` header
for the **POST** requests depending on the `data` type.

  - null => `""`
  - Buffer => `Content-Type: application/octet-stream`
  - Object => `Content-Type: application/json`
  - String => `Content-Type: text/plain`
  - Any => `Content-Type: text/plain`

## Callback data

**request-service** call the given callback when the request is ready.

In case of an error, the callback brings `error.message` and `null`.

When there is no error, it is called with `null` and `data`. The `data` can be `Buffer`, `Object`, `string` or `null`.

**request-service** parses the response data according to the response's `content-type` as follows:

  - `Content-Type: application/octet-stream` => data
  - `Content-Type: application/json` => `JSON.parse( data.toString() )`
  - `Content-Type: application/x-www-form-urlencoded` => `queryString.parse( data.toString() )`
  - other => `data.toString()`

## Methods

**request-service** exports two methods:

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
 * Sends a POST request with "Content-Type: application/x-www-form-urlencoded".
 *
 * @param { string              } url
 * @param { object              } data - values can be object, string, numbers or arrays.
 * @param { OutgoingHttpHeaders } headers
 * @param { ResponseCallback    } callback - optional callback(error, data)
 */
function form(url, data, headers, callback)
````

```javascript

/**
 * Sends a POST request with "Content-Type: application/json".
 *
 * @param { string              } url
 * @param { object              } data
 * @param { OutgoingHttpHeaders } headers
 * @param { ResponseCallback    } callback - optional callback(error, data)
 */
function json(url, data, headers, callback)
```

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
