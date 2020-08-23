"use strict";

const qs      = require("querystring");
const https   = require("https");
const logger  = require("@popovmp/micro-logger");

/**
 * @typedef {function} ResponseCallback
 *
 * @param {null|string} error
 * @param {string|null} data
 * @param {number} [code] - status code
 */

/**
 * Sends a POST request.
 *
 * @param {string} hostname
 * @param {string} path
 * @param {string} data
 * @param {OutgoingHttpHeaders} headers
 * @param {ResponseCallback} [callback] callback(error, data, responseCode)
 */
function post(hostname, path, data, headers, callback) {
    const options = {
        hostname,
        path,
        headers,
        port: 443,
        method: 'POST',
    };

    sendRequest(options, data, callback);
}

/**
 * Sends a GET request.
 *
 * @param {string} hostname
 * @param {string} path
 * @param {Object} query
 * @param {OutgoingHttpHeaders} headers
 * @param {ResponseCallback} [callback] callback(error, data, responseCode)
 */
function get(hostname, path, query, headers, callback) {
    const options = {
        hostname,
        path: path + (query ? "?" + qs.stringify(query) : ""),
        headers,
        port: 443,
        method: 'GET',
    };

    sendRequest(options, "", callback);
}

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

/**
 * @type {{post, get}}
 */
module.exports = {
    post,
    get,
};
