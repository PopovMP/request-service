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
 * @param {string} url
 * @param {any} data
 * @param {OutgoingHttpHeaders} headers
 * @param {ResponseCallback} [callback] callback(error, data, responseCode)
 */
module.exports.post = function post(url, data, headers, callback) {
    const reqUrl = new URL(url);

    const options = {
        hostname: reqUrl.hostname,
        path:     reqUrl.pathname + reqUrl.search,
        headers:  headers,
        port:     reqUrl.port || (reqUrl.protocol === "https:" ? 443 : 80),
        method:   "POST",
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
 * @param {string} url
 * @param {OutgoingHttpHeaders} headers
 * @param {ResponseCallback} [callback] callback(error, data, responseCode)
 */
module.exports.get = function get(url, headers, callback) {
    const reqUrl = new URL(url);

    const options = {
        hostname: reqUrl.hostname,
        path:     reqUrl.pathname + reqUrl.search,
        headers:  headers,
        port:     reqUrl.port || (reqUrl.protocol === "https:" ? 443 : 80),
        method:   "GET",
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
