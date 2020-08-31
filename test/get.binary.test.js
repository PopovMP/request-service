'use strict';

const {ok, strictEqual} = require('assert');
const {describe, it} = require('@popovmp/mocha-tiny');

const request = require('../index.js');

const url = 'https://datafeed.dukascopy.com/datafeed/EURUSD/2020/07/24/07h_ticks.bi5';

request.get(url, {},
    request_get_ready);

/**
 * @type { ResponseCallback }
 *
 * @param { null | string } err
 * @param { Buffer | Object | string | null } data
 * @param { RequestProperties } [prop]
 */
function request_get_ready(err, data, prop) {
    describe('Test GET binary data', () => {

        describe('get(url, headers, callback)', () => {

            it('No errors', () => {
                ok(!err);
            });

            it('Response received', () => {
                ok(data);
            });

            it('Status code 200', () => {
                strictEqual(prop.statusCode, 200);
            });

            it('Status message "OK"', () => {
                strictEqual(prop.statusMessage, 'OK');
            });

            it('Received data is Buffer', () => {
                ok(Buffer.isBuffer(data));
            });

            it('Equal data length and Content-Length', () => {
                const contentLength = parseInt(prop.headers['content-length']);
                strictEqual(data.length, contentLength);
            });
        });
    });
}
