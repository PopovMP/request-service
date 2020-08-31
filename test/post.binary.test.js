'use strict';

const {ok, strictEqual} = require('assert');
const {describe, it} = require('@popovmp/mocha-tiny');

const request = require('../index.js');

const url  = 'https://httpbin.org/post?foo=bar';
const buffer = Buffer.from('foo');

request.post(url, buffer, {},
    requestService_ready);

// noinspection DuplicatedCode
/**
 * @type { ResponseCallback }
 *
 * @param { null | string } err
 * @param { Buffer | Object | string | null } data
 * @param { RequestProperties } [prop]
 */
function requestService_ready(err, data, prop) {
    describe('Test POST binary data', () => {

        describe('post(url, buffer, headers, callback)', () => {

            it('No errors', () => {
                ok(!err);
            });

            it('Status code 200', () => {
                strictEqual(prop.statusCode, 200);
            });

            it('Status message "OK"', () => {
                strictEqual(prop.statusMessage, "OK");
            });

            it('Response received', () => {
                ok(data);
            });

            it('Correct data', () => {
                // noinspection JSUnresolvedVariable
                strictEqual(data.data, 'foo');
            });
        });
    });
}
