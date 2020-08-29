'use strict';

const assert = require('assert');
const {init, test, ensure} = require('@popovmp/micro-tester');

const request = require('../index.js');

const url = 'https://httpbin.org/post?foo=bar';
const data = Buffer.from('foo');

request.post(url, data, {},
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
    init('Test POST binary data');

    test('No errors', () => {
        assert.ok(!err);
    });

    test('Status code 200', () => {
        assert.strictEqual(prop.statusCode, 200);
    });

    test('Status message "OK"', () => {
        assert.strictEqual(prop.statusMessage, "OK");
    });

    test('Response received', () => {
        assert.ok(data);
    });

    test('Correct data', () => {
        // noinspection JSUnresolvedVariable
        assert.strictEqual(data.data, 'foo');
    });

    ensure();
}
