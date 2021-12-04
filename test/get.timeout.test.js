'use strict'

const {strictEqual}  = require('assert')
const {describe, it} = require('@popovmp/mocha-tiny')

const request = require('../index.js')

request.get('https://httpbin.org/delay/10', {'Request-Timeout': 1},
	request_get_ready)

/**
 * @type { ResponseCallback }
 *
 * @param { null | string } err
 * @param { Buffer | Object | string | null } data
 * @param { RequestProperties } [prop]
 */
function request_get_ready(err, data, prop) {
	describe('Test timeout', () => {

		describe('req.destroy()', () => {
			it('Socket hang up', () => {
				strictEqual(err, 'socket hang up')
			})
		})
	})
}
