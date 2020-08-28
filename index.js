"use strict";

const http  = require("http");
const https = require("https");
const queryString = require("querystring");

/**
 * @typedef { function } ResponseCallback
 *
 * @param { null | string } error
 * @param { Buffer | Object | string | null } data
 */

/**
 * @typedef { object } RequestOptions
 *
 * @property { string              } hostname
 * @property { string              } path
 * @property { number              } port
 * @property { string              } protocol
 * @property { OutgoingHttpHeaders } header
 * @property { string              } method
 */

/**
 * Sends a GET request.
 *
 * @param { string              } url
 * @param { OutgoingHttpHeaders } headers
 * @param { ResponseCallback    } callback - callback(error, data)
 */
function get(url, headers, callback) {
    const options = makeReqOptions(url, headers, "GET");

    sendRequest(options, null, callback);
}

/**
 * Sends a POST request.
 *
 * @param { string              } url
 * @param { any                 } data
 * @param { OutgoingHttpHeaders } headers
 * @param { ResponseCallback    } callback - optional callback(error, data)
 */
function post(url, data, headers, callback) {
    const options = makeReqOptions(url, headers, "POST");

    if (data === null) {
        sendPost(options, null, "", callback);
    }
    else if ( Buffer.isBuffer(data) ) {
        sendPost(options, data, "application/octet-stream", callback);
    }
    else if (typeof data === "object") {
        sendPost(options, JSON.stringify(data), "application/json", callback);
    }
    else if (typeof data === "string") {
        sendPost(options, data, "text/plain", callback);
    }
    else {
        sendPost(options, String(data), "text/plain", callback);
    }
}

/**
 * Sends a POST request with "Content-Type: application/x-www-form-urlencoded".
 *
 * @param { string              } url
 * @param { object              } data - values can be object, string, numbers or arrays.
 * @param { OutgoingHttpHeaders } headers
 * @param { ResponseCallback    } callback - optional callback(error, data)
 */
function form(url, data, headers, callback) {
    const options  = makeReqOptions(url, headers, "POST");
    const postForm = queryString.stringify(data);
    sendPost(options, postForm, "application/x-www-form-urlencoded", callback);
}

/**
 * Sends a POST request with "Content-Type: application/json".
 *
 * @param { string              } url
 * @param { object              } data
 * @param { OutgoingHttpHeaders } headers
 * @param { ResponseCallback    } callback - optional callback(error, data)
 */
function json(url, data, headers, callback) {
    const options  = makeReqOptions(url, headers, "POST");
    const postText = JSON.stringify(data);
    sendPost(options, postText, "application/json", callback);
}

/**
 * Parses an URL string
 *
 * @param { string              } url
 * @param { OutgoingHttpHeaders } headers
 * @param { string              } method
 *
 * @return { RequestOptions }
 */
function makeReqOptions(url, headers, method) {
    /** @type { URL } */
    const urlObj = new URL(url);

    return {
        hostname: urlObj.hostname,
        path:     urlObj.pathname + urlObj.search,
        port:     urlObj.port || (urlObj.protocol === "https:" ? 443 : 80),
        protocol: urlObj.protocol,
        headers,
        method
    };
}

/**
 * Prepares post request headers and sends the request
 *
 * @param { RequestOptions     } options
 * @param { Buffer|string|null } data
 * @param { string             } contentType
 * @param { ResponseCallback   } callback
 */
function sendPost(options, data, contentType, callback) {
    if (Buffer.isBuffer(data) || typeof data === "string") {
        options.headers["Content-Length"] = Buffer.byteLength(data);
    }

    if (contentType && !options.headers["Content-Type"]) {
        options.headers["Content-Type"] = contentType;
    }

    sendRequest(options, data, callback);
}

/**
 * Sends a request
 *
 * @param { RequestOptions     } options
 * @param { Buffer|string|null } postData
 * @param { ResponseCallback   } callback
 */
function sendRequest(options, postData, callback) {
    const transporter = options.protocol === "https:"
        ? https
        : http;

    const req = transporter.request(options,
        reqCallback);

    req.on("error", (err) => {
        callback(err.message, null);
    });

    if (postData) {
        req.write(postData);
    }

    req.end();

    /**
     * @param  { IncomingMessage } res
     */
    function reqCallback(res) {
        const data = [];

        res.on("data", (chunk) => {
            data.push(chunk);
        });

        res.on("end", () => {
            /** @type { Buffer | Object | string } */
            let resData = null;
            let err     = null;

            try {
                resData = parseResData(Buffer.concat(data), res.headers["content-type"]);
            } catch (e) {
                err = e.message;
            }

            callback(err, resData);
        });
    }

    /**
     * Prepares response data
     *
     * @param { Buffer } buffer
     * @param { string } contentType
     *
     * @return { Buffer | Object | string }
     */
    function parseResData(buffer, contentType) {
        if (contentType.includes("octet-stream")) {
            return buffer;
        }

        if (contentType.includes("json")) {
            return JSON.parse(buffer.toString());
        }

        if (contentType.includes("urlencoded")) {
            return queryString.parse(buffer.toString());
        }

        return buffer.toString();
    }
}

module.exports = {
    get,
    post,
    form,
    json,
}
