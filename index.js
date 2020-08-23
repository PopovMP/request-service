"use strict";

const qs      = require("querystring");
const request = require("request");
const logger  = require("@popovmp/micro-logger");

const successCodes = [
    200, // OK 200
    201, // CREATED 201
    202, // Accepted 202
    203, // Partial Information 203
    204, // No Response 204
    301, // Moved 301
    302, // Found 302
    303, // Method 303
    304, // Not Modified 304
];

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
 * @param {string} url
 * @param {Object} form
 * @param {Object} headers
 * @param {ResponseCallback} [callback] callback(error, data, responseCode)
 */
function post(url, form, headers, callback) {
    const options = {
        method: "POST",
        url,
        form,
        headers,
    };

    request(options,
        request_ready.bind(null, callback));
}

/**
 * Sends a GET request.
 *
 * @param {string} url
 * @param {Object} query
 * @param {Object} headers
 * @param {ResponseCallback} callback
 */
function get(url, query, headers, callback) {
    const options = {
        method: "GET",
        url: url + (query ? "?" + qs.stringify(query) : ""),
        headers,
    };

    request(options,
        request_ready.bind(null, callback));
}

/**
 *
 * @param {ResponseCallback | undefined} callback
 * @param {string | null} err
 * @param {object} res
 * @param {string} body
 */
function request_ready(callback, err, res, body) {
    if (err) {
        logger.error(err, "request-service::request_ready");
    } else if ( !successCodes.includes(res.statusCode) ) {
        logger.error("Error: " + res.statusMessage, "request-service::request_ready");
    }

    if (typeof callback === "function") {
        if (err) {
            callback(err, null, res.statusCode);
        } else if ( successCodes.includes(res.statusCode) ) {
            callback(null, body, res.statusCode);
        } else {
            callback(res.statusMessage, null, res.statusCode);
        }
    }
}

/**
 * @type {{post, get}}
 */
module.exports = {
    post,
    get,
};
