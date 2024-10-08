"use strict";

const http  = require("http");
const https = require("https");
const qs    = require("qs");

/**
 * @typedef { function } ResponseCallback
 *
 * @param { null | string             } error
 * @param { Buffer|Object|string|null } data
 * @param { RequestProperties         } [prop]
 */

/**
 * @typedef { Object } RequestProperties
 *
 * @property { boolean | undefined } complete
 * @property { Object              } headers
 * @property { string              } host
 * @property { string  | undefined } httpVersion
 * @property { string              } method
 * @property { number              } outputSize
 * @property { string              } path
 * @property { string              } protocol
 * @property { number  | undefined } statusCode
 * @property { string  | undefined } statusMessage
 */

/**
 * @typedef { Record<string, string|number> } RequestHeaders
 */

/**
 * @typedef { Object } RequestOptions
 *
 * @property { string         } hostname
 * @property { string         } path
 * @property { number         } port
 * @property { string         } protocol
 * @property { RequestHeaders } headers
 * @property { string         } method
 */

/**
 * @typedef { Record<string, string|number|any> } FormData
 */

/**
 * Sends a HEAD request.
 *
 * @param { string           } url
 * @param { RequestHeaders   } headers
 * @param { ResponseCallback } callback
 *
 * @return { void }
 */
function head(url, headers, callback) {
    const options = makeReqOptions(url, headers, "HEAD");

    sendRequest(options, null, callback);
}

/**
 * Sends a GET request.
 *
 * @param { string           } url
 * @param { RequestHeaders   } headers
 * @param { ResponseCallback } callback
 *
 * @return { void }
 */
function get(url, headers, callback) {
    const options = makeReqOptions(url, headers, "GET");

    sendRequest(options, null, callback);
}

/**
 * Sends a POST request.
 *
 * @param { string           } url
 * @param { any              } data
 * @param { RequestHeaders   } headers
 * @param { ResponseCallback } callback
 *
 * @return { void }
 */
function post(url, data, headers, callback) {
    postPut("POST", url, data, headers, callback);
}

/**
 * Sends a PUT request.
 *
 * @param { string           } url
 * @param { any              } data
 * @param { RequestHeaders   } headers
 * @param { ResponseCallback } callback
 *
 * @return { void }
 */
function put(url, data, headers, callback) {
    postPut("PUT", url, data, headers, callback);
}

/**
 * Sends a POST or PUT request.
 *
 * @param { string           } method
 * @param { string           } url
 * @param { any              } data
 * @param { RequestHeaders   } headers
 * @param { ResponseCallback } callback
 *
 * @return { void }
 */
function postPut(method, url, data, headers, callback) {
    const options = makeReqOptions(url, headers, method);

    if (data === null || data === undefined) {
        sendPost(options, null, "", callback);
        return;
    }

    if ( Buffer.isBuffer(data) ) {
        sendPost(options, data, "application/octet-stream", callback);
        return;
    }

    if (typeof data === "object") {
        sendPost(options, JSON.stringify(data), "application/json", callback);
        return;
    }

    if (typeof data === "string") {
        sendPost(options, data, "text/plain", callback);
        return;
    }

    sendPost(options, String(data), "text/plain", callback);
}

/**
 * Sends a POST request with "Content-Type: application/x-www-form-urlencoded".
 *
 * @param { string           } url
 * @param { FormData         } data
 * @param { RequestHeaders   } headers
 * @param { ResponseCallback } callback
 *
 * @return { void }
 */
function form(url, data, headers, callback) {
    const options  = makeReqOptions(url, headers, "POST");
    const postForm = qs.stringify(data);

    sendPost(options, postForm, "application/x-www-form-urlencoded", callback);
}

/**
 * Sends a POST request with "Content-Type: application/json".
 *
 * @param { string           } url
 * @param { any              } data
 * @param { RequestHeaders   } headers
 * @param { ResponseCallback } callback
 *
 * @return { void }
 */
function json(url, data, headers, callback) {
    const options  = makeReqOptions(url, headers, "POST");
    const postText = JSON.stringify(data);

    sendPost(options, postText, "application/json", callback);
}

/**
 * Parses a URL string
 *
 * @param { string         } url
 * @param { RequestHeaders } headers
 * @param { string         } method
 *
 * @return { RequestOptions }
 */
function makeReqOptions(url, headers, method) {
    /** @type { URL } */
    const urlObj = new URL(url);

    return {
        hostname: urlObj.hostname,
        path    : urlObj.pathname + urlObj.search,
        port    : urlObj.port || (urlObj.protocol === "https:" ? 443 : 80),
        protocol: urlObj.protocol,
        headers,
        method,
    };
}

/**
 * Prepares request headers and sends the request
 *
 * @param { RequestOptions     } options
 * @param { Buffer|string|null } data
 * @param { string             } contentType
 * @param { ResponseCallback   } callback
 *
 * @return { void }
 */
function sendPost(options, data, contentType, callback) {
    if (Buffer.isBuffer(data) || typeof data === "string") {
        options.headers["Content-Length"] = Buffer.byteLength(data).toString();
    }

    if (contentType && !options.headers["Content-Type"]) {
        options.headers["Content-Type"] = contentType;
    }

    sendRequest(options, data, callback);
}

// noinspection JSCheckFunctionSignatures
/**
 * Sends a request
 *
 * @param { RequestOptions     } options
 * @param { Buffer|string|null } postData
 * @param { ResponseCallback   } callback
 *
 * @return { void }
 */
function sendRequest(options, postData, callback) {
    const transporter = options.protocol === "https:" ? https : http;
    const req         = transporter.request(options, reqCallback);
    let   isReady     = false;

    if (options.headers && typeof options.headers["Request-Timeout"] === "number") {
        req.setTimeout(options.headers["Request-Timeout"] * 1000);
    }

    req.on("error", (err) => {
        onReady(err.message, null, req);
    });

    req.on("timeout", () => {
        req.destroy();
    });

    if (postData) {
        req.write(postData);
    }

    req.end();

    /**
     * @param  { IncomingMessage } res
     */
    function reqCallback(res) {
        /** @type { Buffer[] } */
        const chunks = [];

        res.on("data", (chunk) => {
            chunks.push(chunk);
        });

        res.on("error", (err) => {
            onReady(err.message, null, res);
        });

        res.on("end", () => {
            /** @type { Buffer | Object | string | null } */
            let body = null;

            /** @type { string | null } */
            let err = null;

            try {
                body = parseBody(Buffer.concat(chunks), res.headers["content-type"]);
            }
            catch (e) {
                err = e.message;
            }

            onReady(err, body, res);
        })
    }

    function onReady(err, data, target) {
        if (isReady) return;
        isReady = true;

        /** @type { RequestProperties } */
        const prop = getRequestProperties(this, target);

        callback(err, data, prop);
    }
}

/**
 * Prepares response data
 *
 * @param { Buffer } buffer
 * @param { string } [contentType]
 *
 * @return { Buffer | Object | string }
 */
function parseBody(buffer, contentType = "") {
    if (contentType.startsWith("application/octet-stream")) {
        return buffer;
    }

    if (contentType.startsWith("application/zip")) {
        return buffer;
    }

    if (contentType.startsWith("application/json")) {
        return JSON.parse(buffer.toString());
    }

    if (contentType.startsWith("application/x-www-form-urlencoded")) {
        return qs.parse(buffer.toString());
    }

    return buffer.toString();
}
/**
 * Copies the response properties
 *
 * @param { ClientRequest   } [req]
 * @param { IncomingMessage } [res]
 *
 * @return { RequestProperties }
 */
function getRequestProperties(req, res) {
    // noinspection JSUnresolvedVariable
    return {
        complete     : res && res.complete,
        headers      : res && res.headers ? {...res.headers} : {},
        host         : req && req.host,
        httpVersion  : res && res.httpVersion,
        method       : req && req.method,
        outputSize   : req && req.outputSize,
        path         : req && req.path,
        protocol     : req && req.protocol,
        statusCode   : res && res.statusCode,
        statusMessage: res && res.statusMessage,
    };
}

module.exports = {
    head,
    get,
    post,
    put,
    form,
    json,
    requestHead: head,
    requestGet : get,
    requestPost: post,
    requestPut : put,
    requestForm: form,
    requestJson: json,
};
