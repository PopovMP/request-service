'use strict'

const {ok, strictEqual} = require('assert')
const {describe, it}    = require('@popovmp/mocha-tiny')

const request = require('../index.js')

request.head('https://httpbin.org', {},
	request_head_ready)

/**
 * @type { ResponseCallback }
 *
 * @param { null | string } err
 * @param { Buffer | Object | string | null } data
 * @param { RequestProperties } [prop]
 */
function request_head_ready(err, data, prop)
{
	describe('Test HEAD request', () => {

		describe('head(url, headers, callback)', () => {

			it('No errors', () => {
				ok(!err)
			})

			it('No data', () => {
				ok(!data)
			})

			it('Status code 200', () => {
				strictEqual(prop.statusCode, 200)
			})

			it('Status message "OK"', () => {
				strictEqual(prop.statusMessage, 'OK')
			})
		})
	})
}
