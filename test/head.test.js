'use strict';

const assert = require('assert');
const {init, test, ensure} = require('@popovmp/micro-tester');

const request = require('../index.js');

request.head('https://httpbin.org', {},
    requestService_ready);

/**
 * @type { ResponseCallback }
 *
 * @param { null | string } err
 * @param { Buffer | Object | string | null } data
 * @param { RequestProperties } [prop]
 */
function requestService_ready(err, data, prop) {
    init('Test HEAD request');

    test('No errors', () => {
        assert.ok(!err);
    });

    test('No data', () => {
        assert.ok(!data);
    });

    test('Status code 200', () => {
        assert.strictEqual(prop.statusCode, 200);
    });

    test('Status message "OK"', () => {
        assert.strictEqual(prop.statusMessage, "OK");
    });

    ensure();
}
