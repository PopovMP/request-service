'use strict';

const assert = require('assert');
const {init, test, ensure} = require('@popovmp/micro-tester');

const request = require('../index.js');
const headers = {};

const url = 'https://datafeed.dukascopy.com/datafeed/EURUSD/2020/07/24/07h_ticks.bi5';

request.get(url, headers,
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
    init('Test GET binary data');

    test('No errors', () => {
        assert.ok(!err);
    });

    test('Response received', () => {
        assert.ok(data);
    });

    test('Status code 200', () => {
        assert.strictEqual(prop.statusCode, 200);
    });

    test('Status message "OK"', () => {
        assert.strictEqual(prop.statusMessage, "OK");
    });

    test('Received data is Buffer', () => {
        assert.ok(Buffer.isBuffer(data));
    });

    test('Equal data length and Content-Length', () => {
        const contentLength = parseInt( prop.headers['content-length'] );
        assert.strictEqual(data.length, contentLength);
    });

    ensure();
}
