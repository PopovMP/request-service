'use strict'

const {strictEqual}  = require('assert')
const {describe, it} = require('@popovmp/mocha-tiny')

const request = require('../index.js')

describe('Test GET 0 bytes', () => {
	request.get('https://datafeed.dukascopy.com/datafeed/USATECHIDXUSD/2021/11/03/22h_ticks.bi5', {},
		request_get_ready)

	request.get('https://datafeed.dukascopy.com/datafeed/USATECHIDXUSD/2021/11/03/23h_ticks.bi5', {},
		request_get_ready)

	/**
	 * @type { ResponseCallback }
	 *
	 * @param { null | string } err
	 * @param { Buffer | Object | string | null } data
	 * @param { RequestProperties } [prop]
	 */
	function request_get_ready(err, data, prop) {

		describe('get(url, headers, callback)', () => {
			it('Status code 200', () => {
				strictEqual(prop.statusCode, 200)
			})

			it('Content-length 0', () => {
				strictEqual(prop.headers['content-length'], '0')
			})
		})
	}
})
