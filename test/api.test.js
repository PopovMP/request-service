'use strict'

const {strictEqual }  = require('assert')
const {describe, it} = require('@popovmp/mocha-tiny')

const request = require('../index.js')

setImmediate(testApi)

function testApi()
{
	describe('Request Service API', () => {

		describe('head(url, headers, callback)', () => {
			it('is a function', () => {
				strictEqual(typeof request.head, 'function')
			})

			it('accepts 3 arguments', () => {
				strictEqual(request.head.length, 3)
			})
		})

		describe('get(url, headers, callback)', () => {
			it('is a function', () => {
				strictEqual(typeof request.get, 'function')
			})

			it('accepts 3 arguments', () => {
				strictEqual(request.get.length, 3)
			})
		})

		describe('post(url, data, headers, callback)', () => {
			it('is a function', () => {
				strictEqual(typeof request.post, 'function')
			})

			it('accepts 4 arguments', () => {
				strictEqual(request.post.length, 4)
			})
		})

		describe('form(url, data, headers, callback)', () => {
			it('is a function', () => {
				strictEqual(typeof request.form, 'function')
			})

			it('accepts 4 arguments', () => {
				strictEqual(request.form.length, 4)
			})
		})

		describe('json(url, data, headers, callback)', () => {
			it('is a function', () => {
				strictEqual(typeof request.json, 'function')
			})

			it('accepts 4 arguments', () => {
				strictEqual(request.json.length, 4)
			})
		})
	})
}
