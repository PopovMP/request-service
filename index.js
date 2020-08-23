"use strict";

const https  = require("https");
const logger = require("@popovmp/micro-logger");

/**
 * @typedef {function} ResponseCallback
 *
 * @param {null|string} error
 * @param {string|null} data
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
        port: 443,
        method: 'POST',
    };

    const dataText = typeof data === "string"
        ? data
        : JSON.stringify(data);

    sendRequest(options, dataText, callback);
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
        port: 443,
        method: 'GET',
    };

    sendRequest(options, "", callback);
}

/**
 * Sends a request
 *
 * @param {RequestOptions} options
 * @param {string} data
 * @param {ResponseCallback} [callback]
 */
function sendRequest(options, data, callback) {
    const req = https.request(options, (resp) => {
        const chunks = [];
        resp.on('data', (chunk) => chunks.push(chunk));
        resp.on('end', () => {
            if (typeof callback === "function") {
                callback(null, chunks.join(""), resp.statusCode);
            }
        });
    });

    req.on("error", (err) => {
        logger.error("Error: " + err.message, "request-service::sendRequest");
        if (typeof callback === "function") {
            callback(err.message, null);
        }
    });

    req.write(data);
    req.end();
}
