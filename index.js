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
 * Sends a POST request.
 *
 * @param {string} hostname
 * @param {string} path
 * @param {any} data
 * @param {OutgoingHttpHeaders} headers
 * @param {ResponseCallback} [callback] callback(error, data, responseCode)
 */
module.exports.post = function post(hostname, path, data, headers, callback) {
    const options = {
        hostname,
        path,
        headers,
        port:   443,
        method: "POST",
    };

    const postData = typeof data === "string"
        ? data
        : Buffer.isBuffer(data)
            ? data
            : JSON.stringify(data);

    sendRequest(options, postData, callback);
}

/**
 * Sends a GET request.
 *
 * @param {string} hostname
 * @param {string} path
 * @param {OutgoingHttpHeaders} headers
 * @param {ResponseCallback} [callback] callback(error, data, responseCode)
 */
module.exports.get = function get(hostname, path, headers, callback) {
    const options = {
        hostname,
        path,
        headers,
        port:   443,
        method: "GET",
    };

    sendRequest(options, null, callback);
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
                const isBinary = data.length && /\ufffd/.test(data[0]);
                const resData = isBinary
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
