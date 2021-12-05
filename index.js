'use strict'

const http        = require('http')
const https       = require('https')
const queryString = require('querystring')

/**
 * @typedef { function } ResponseCallback
 *
 * @param { null | string             } error
 * @param { Buffer|Object|string|null } data
 * @param { RequestProperties         } [prop]
 */

/**
 * @typedef { object } RequestProperties
 *
 * @property { boolean | undefined } aborted
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
 * @typedef { object } RequestOptions
 *
 * @property { string              } hostname
 * @property { string              } path
 * @property { number              } port
 * @property { string              } protocol
 * @property { OutgoingHttpHeaders } headers
 * @property { string              } method
 */

/**
 * Sends a HEAD request.
 *
 * @param { string              } url
 * @param { OutgoingHttpHeaders | * } headers
 * @param { ResponseCallback    } callback
 *
 * @return { void }
 */
function head(url, headers, callback) {
	let options

	try {
		options = makeReqOptions(url, headers, 'HEAD')
	} catch (e) {
		callback(e.message, null, getRequestProperties())
		return
	}

	sendRequest(options, null, callback)
}

/**
 * Sends a GET request.
 *
 * @param { string              } url
 * @param { OutgoingHttpHeaders | * } headers
 * @param { ResponseCallback    } callback
 *
 * @return { void }
 */
function get(url, headers, callback) {
	let options

	try {
		options = makeReqOptions(url, headers, 'GET')
	} catch (e) {
		callback(e.message, null, getRequestProperties())
		return
	}

	sendRequest(options, null, callback)
}

/**
 * Sends a POST request.
 *
 * @param { string              } url
 * @param { any                 } data
 * @param { OutgoingHttpHeaders | * } headers
 * @param { ResponseCallback    } callback
 *
 * @return { void }
 */
function post(url, data, headers, callback) {
	let options

	try {
		options = makeReqOptions(url, headers, 'POST')
	} catch (e) {
		callback(e.message, null, getRequestProperties())
		return
	}

	if (data === null || data === undefined) {
		sendPost(options, null, '', callback)
	}
	else if (Buffer.isBuffer(data)) {
		sendPost(options, data, 'application/octet-stream', callback)
	}
	else if (typeof data === 'object') {
		sendPost(options, JSON.stringify(data), 'application/json', callback)
	}
	else if (typeof data === 'string') {
		sendPost(options, data, 'text/plain', callback)
	}
	else {
		sendPost(options, String(data), 'text/plain', callback)
	}
}

/**
 * Sends a POST request with 'Content-Type: application/x-www-form-urlencoded'.
 *
 * @param { string              } url
 * @param { object              } data - values can be an object, string, numbers or arrays.
 * @param { OutgoingHttpHeaders | * } headers
 * @param { ResponseCallback    } callback
 *
 * @return { void }
 */
function form(url, data, headers, callback) {
	let options

	try {
		options = makeReqOptions(url, headers, 'POST')
	} catch (e) {
		callback(e.message, null, getRequestProperties())
		return
	}

	const postForm = queryString.stringify(data)

	sendPost(options, postForm, 'application/x-www-form-urlencoded', callback)
}

/**
 * Sends a POST request with 'Content-Type: application/json'.
 *
 * @param { string              } url
 * @param { object              } data
 * @param { OutgoingHttpHeaders | * } headers
 * @param { ResponseCallback    } callback
 *
 * @return { void }
 */
function json(url, data, headers, callback) {
	let options

	try {
		options = makeReqOptions(url, headers, 'POST')
	} catch (e) {
		callback(e.message, null, getRequestProperties())
		return
	}

	const postText = JSON.stringify(data)

	sendPost(options, postText, 'application/json', callback)
}

/**
 * Parses an URL string
 *
 * @param { string } url
 * @param { OutgoingHttpHeaders | * } headers
 * @param { string } method
 *
 * @return { RequestOptions }
 */
function makeReqOptions(url, headers, method) {
	/** @type { URL } */
	const urlObj = new URL(url)

	return {
		hostname: urlObj.hostname,
		path    : urlObj.pathname + urlObj.search,
		port    : urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
		protocol: urlObj.protocol,
		headers,
		method,
	}
}

/**
 * Prepares post request headers and sends the request
 *
 * @param { RequestOptions     } options
 * @param { Buffer|string|null } data
 * @param { string             } contentType
 * @param { ResponseCallback   } callback
 *
 * @return { void }
 */
function sendPost(options, data, contentType, callback) {
	if (Buffer.isBuffer(data) || typeof data === 'string') {
		options.headers['Content-Length'] = Buffer.byteLength(data)
	}

	if (contentType && !options.headers['Content-Type']) {
		options.headers['Content-Type'] = contentType
	}

	sendRequest(options, data, callback)
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
	const transporter    = options.protocol === 'https:' ? https : http
	const req            = transporter.request(options, reqCallback)

	if (options.headers && typeof options.headers['Request-Timeout'] === 'number') {
		req.setTimeout(options.headers['Request-Timeout'] * 1000)
	}

	req.on('error', (err) => {
		onReady(err.message, null, req)
	})

	req.on('abort', () => {
		onReady('Request abort', null, req)
	})

	req.on('timeout', () => {
		// Destroy the request to prevent a double callback call.
		req.destroy()
	})

	if (postData) {
		req.write(postData)
	}

	req.end()

	/**
	 * @param  { IncomingMessage } res
	 */
	function reqCallback(res) {
		/** @type { Buffer[] } */
		const chunks = []

		res.on('data', (chunk) => {
			chunks.push(chunk)
		})

		res.on('end', () => {
			/** @type { Buffer | Object | string | null } */
			let body = null

			/** @type { string | null } */
			let err = null

			try {
				body = parseBody(Buffer.concat(chunks), res.headers['content-type'])
			} catch (e) {
				err = e.message
			}

			onReady(err, body, res)
		})

		res.on('aborted', () => {
			onReady('Response aborted', null, res)
		})

		res.on('error', (err) => {
			onReady(err.message, null, res)
		})
	}

	function onReady(err, data, target) {
		/** @type { RequestProperties } */
		const prop = getRequestProperties(this, target)
		callback(err, data, prop)
	}

	/**
	 * Prepares response data
	 *
	 * @param { Buffer } buffer
	 * @param { string } contentType
	 *
	 * @return { Buffer | Object | string }
	 */
	function parseBody(buffer, contentType) {
		if (contentType?.includes('octet-stream')) {
			return buffer
		}

		if (contentType?.includes('application/zip')) {
			return buffer
		}

		if (contentType?.includes('json')) {
			return JSON.parse(buffer.toString())
		}

		if (contentType?.includes('urlencoded')) {
			return queryString.parse(buffer.toString())
		}

		return buffer.toString()
	}
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
		aborted      : res?.aborted,
		complete     : res?.complete,
		headers      : {...res?.headers},
		host         : req?.host,
		httpVersion  : res?.httpVersion,
		method       : req?.method,
		outputSize   : req?.outputSize,
		path         : req?.path,
		protocol     : req?.protocol,
		statusCode   : res?.statusCode,
		statusMessage: res?.statusMessage,
	}
}

module.exports = {
	head,
	get,
	post,
	form,
	json,
	requestHead: head,
	requestGet : get,
	requestPost: post,
	requestForm: form,
	requestJson: json,
}
