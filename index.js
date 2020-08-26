"use strict";
const https  = require("https");
const logger = require("@popovmp/micro-logger");

/**
 * @typedef {function} ResponseCallback
 *
 * @param {null|string} error
 * @param {Buffer|string|null} data
 * @param {number} [code] - status code
 */

/**
 * @typedef {object} RequestOptions
 *
 * @property {string} hostname
 * @property {string} path
 * @property {OutgoingHttpHeaders} header
 */

/**
 * Sends a GET request.
 *
 * @param { string } url
 * @param { OutgoingHttpHeaders } headers
 * @param { ResponseCallback } [callback] callback(error, data, responseCode)
 */
function get(url, headers, callback) {
    const options = makeReqOptions(url, headers, "GET");

    sendRequest(options, null, callback);
}

/**
 * Sends a POST request.
 *
 * @param { string } url
 * @param { any } data
 * @param { OutgoingHttpHeaders } headers
 * @param { ResponseCallback } [callback] callback(error, data, responseCode)
 */
function post(url, data, headers, callback) {
    const options = makeReqOptions(url, headers, "POST");

    const postData = typeof data === "string"
        ? data
        : Buffer.isBuffer(data)
            ? data
            : JSON.stringify(data);

    sendRequest(options, postData, callback);
}

/**
 * Parses an URL string
 *
 * @param { string } url
 * @param { OutgoingHttpHeaders } headers
 * @param { string } method
 *
 * @return { Object }
 */
function makeReqOptions(url, headers, method) {
    const urlObj = new URL(url);

    return {
        hostname: urlObj.hostname,
        path:     urlObj.pathname + urlObj.search,
        port:     urlObj.port || (urlObj.protocol === "https:" ? 443 : 80),
        headers,
        method
    };
}

/**
 * Sends a request
 *
 * @param {RequestOptions} options
 * @param {Buffer|string|null} postData
 * @param {ResponseCallback} [callback]
 */
function sendRequest(options, postData, callback) {
    const req = https.request(options, (res) => {
        const data = [];

        res.on('data', (chunk) => data.push(chunk));

        res.on('end', () => {
            if (typeof callback === "function") {
                const resData = Buffer.isBuffer(data[0])
                    ? Buffer.concat(data)
                    : data.join("");

                callback(null, resData, res.statusCode);
            }
        });
    });

    req.on("error", (err) => {
        logger.error("Error: " + err.message, "request-service::sendRequest");

        if (typeof callback === "function") {
            callback(err.message, null);
        }
    });

    if (postData !== null) {
        req.write(postData);
    }

    req.end();
}

module.exports = {
    get,
    post,
}
