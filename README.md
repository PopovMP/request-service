# Make HEAD, GET, and POST requests with default headers and parse the response

**request-service** sends `GET`, `POST`, and `HEAD` request with some automations:
  - sets default `Content-Type` header depending on the data type
  - sets the `Content-Length` header
  - parses the received data depending on the incoming headers to `JSON`, `Buffer`, or a `string`.
  - provides the Request / Response properties in the callback

Homepage: https://github.com/popovmp/request-service#readme

## Synopsis

Make a **HEAD** request

```javascript
const request = require('@popovmp/request-service');

request.head('https://example.com', {}, (err, data, prop) => {
    console.log( prop.statusCode === 200
        ? 'The server is online!'
        : 'The server is down...' );
});
```

Make a **GET** request

```javascript
const url     = 'https://example.com/get?foo=bar';
const headers = {'Username': 'John Doe'};

request.get(url, headers, callback);
```

Make a **POST** request

```javascript
const url     = 'https://example.com/post?foo=bar';
const data    = {answer: 42}; // Can be anything
const headers = {'Username': 'John Doe'};

request.post(url, data, headers, callback);
```

**POST form** request with a `Content-Type: x-www-form-urlencoded` header

**Note** - `form-urlencoded` queries **do not contain arrays**.
If your query object has an array, the corresponding field will be ignored in the request. 

```javascript
const url     = 'https://example.com/form';
const form    = {name: 'John Doe', email: 'john@example.com'};
const headers = {};

request.form(url, form, headers, callback);
```

**POST json** request with a `Content-Type: application/json` header

```javascript
const url     = 'https://example.com/api';
const object  = {answer: 42, numbers: [1, 2, 3, 4]};
const headers = {};

request.json(url, object, headers, callback);
```

The **request-service** accepts equal callback for both GET and POST requests.

```javascript
function callback(err, data, prop) {
    if (err) {
        console.error('Error: ' + err);
    }

    console.log(data);

    console.log( JSON.stringify(prop, null, 2) );
}
````

## Installation

```
npm install @popovmp/request-service
```

## Usage

**request-service** is a http/https client. It sends requests and manages the responses. It also tries to set proper
'Content-Type' headers for the request and to parse the response body.

Yuo can use it in ywo ways:

```javascript
const request = require('@popovmp/request-service');

request.form(url, data, headers, callback);
``` 

or you can use convenient method aliases:

```javascript
const { requestHead, requestGet, requestPost, requestForm, requestJson } = require('@popovmp/request-service');
```

## Default Content-Type header

If, you do not provide a `Content-Type` header, **request-service** sets a default `Content-Type` header
for the **POST** requests depending on the `data` type.

  - null => `''`
  - Buffer => `Content-Type: application/octet-stream`
  - Object => `Content-Type: application/json`
  - String => `Content-Type: text/plain`
  - Any => `Content-Type: text/plain`

## Callback data

**request-service** call the given callback when the request is ready.

```javascript
// Request callback
function request_ready(err, data, prop) { }
```

In case of an error, the callback receives the error message and the Request properties.

When there is no error, it is called with `null` and `data`. The `data` can be `Buffer`, `Object`, `string` or `null`.

**request-service** parses the response data according to the response's `content-type` as follows:

  - `Content-Type: application/octet-stream` => data
  - `Content-Type: application/json` => `JSON.parse( data.toString() )`
  - `Content-Type: application/x-www-form-urlencoded` => `queryString.parse( data.toString() )`
  - other => `data.toString()`

The Request properties is an object with properties from the outgoing request and incoming response.

An example of **Request properties**:

```json
{
  "aborted": false,
  "complete": true,
  "headers": {
    "date": "Sat, 29 Aug 2020 06:41:37 GMT",
    "content-type": "application/json",
    "content-length": "283",
    "connection": "close",
    "server": "gunicorn/19.9.0",
    "access-control-allow-origin": "*",
    "access-control-allow-credentials": "true"
  },
  "host": "httpbin.org",
  "httpVersion": "1.1",
  "method": "GET",
  "outputSize": 0,
  "path": "/get?foo=bar",
  "protocol": "https:",
  "statusCode": 200,
  "statusMessage": "OK"
}
```

## Methods

**request-service** exports the following methods: `head`, `get`, `post`, `form`, and `json`.

```javascript
/**
 * Sends a HEAD request.
 *
 * @param { string              } url
 * @param { OutgoingHttpHeaders } headers
 * @param { ResponseCallback    } callback
 */
function head(url, headers, callback) { }
```

```javascript
/**
 * Sends a GET request.
 *
 * @param {string} url
 * @param {OutgoingHttpHeaders} headers
 * @param {ResponseCallback} callback
 */
function get(url, headers, callback) { }
````

```javascript
/**
 * Sends a POST request.
 *
 * @param {string} url
 * @param {any} data
 * @param {OutgoingHttpHeaders} headers
 * @param {ResponseCallback} callback
 */
function post(url, data, headers, callback) { }
````

```javascript
/**
 * Sends a POST request with 'Content-Type: application/x-www-form-urlencoded'.
 *
 * @param { string              } url
 * @param { object              } data - values can be object, string, numbers or arrays.
 * @param { OutgoingHttpHeaders } headers
 * @param { ResponseCallback    } callback
 */
function form(url, data, headers, callback) { }
````

```javascript

/**
 * Sends a POST request with 'Content-Type: application/json'.
 *
 * @param { string              } url
 * @param { object              } data
 * @param { OutgoingHttpHeaders } headers
 * @param { ResponseCallback    } callback
 */
function json(url, data, headers, callback) { }
```

Where:

```javascript
/**
 * @typedef { function } ResponseCallback
 *
 * @param { null | string } error
 * @param { Buffer | Object | string | null } data
 * @param { RequestProperties } prop
 */
function request_ready(err, data, prop) { }
````

## License

`request-service` is free for use and modification. No responsibilities for damages of any kind.

Copyright (c) 2022 Miroslav Popov
