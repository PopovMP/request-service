'use strict'

const {ok}           = require('assert')
const {describe, it} = require('@popovmp/mocha-tiny')

const request = require('../index.js')

request.get('https://example.com', undefined, (err, data) => {
    describe('Fallback', () => {
        describe('get(url, undefined, callback)', () => {
            it('headers: undefined', () => {
                ok(!err)
                ok(data)
            })
        })
    })
})
