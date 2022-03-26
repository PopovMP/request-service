'use strict'

const {ok, strictEqual} = require('assert')
const {describe, it   } = require('@popovmp/mocha-tiny')

const request = require('../index.js')

const url     = 'https://httpbin.org/get?foo=bar'
const headers = {
	'Client': 'request-service',
	'Answer': 42,
}

request.get(url, headers,
	requestService_ready)

/**
 * @type { ResponseCallback }
 *
 * @param { null | string } err
 * @param { Buffer | Object | string | null } data
 * @param { RequestProperties } [prop]
 */
function requestService_ready(err, data, prop)
{
	describe('Test GET generic data', () => {

		describe('get(url, headers, callback)', () => {

			it('No errors', () => {
				ok(!err)
			})

			it('Response received', () => {
				ok(data)
			})

			it('Status code 200', () => {
				strictEqual(prop.statusCode, 200)
			})

			it('Status message "OK"', () => {
				strictEqual(prop.statusMessage, 'OK')
			})

			it('Correct query', () => {
				// noinspection JSUnresolvedVariable
				strictEqual(data.args.foo, 'bar')
			})

			it('Correct string header', () => {
				// noinspection JSUnresolvedVariable
				strictEqual(data.headers.Client, 'request-service')
			})

			it('Correct numeric header', () => {
				// noinspection JSUnresolvedVariable
				strictEqual(data.headers.Answer, '42')
			})
		})
	})
}
