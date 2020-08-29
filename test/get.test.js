'use strict';

const assert = require('assert');
const {init, test, ensure} = require('@popovmp/micro-tester');

const request = require('../index.js');

const url = 'https://httpbin.org/get?foo=bar';
const headers = {
    'Client': 'request-service',
    'Answer': 42,
};

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
    init('Test GET generic data');

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

    test('Correct query', () => {
        // noinspection JSUnresolvedVariable
        assert.strictEqual(data.args.foo, 'bar');
    });

    test('Correct string header', () => {
        // noinspection JSUnresolvedVariable
        assert.strictEqual(data.headers.Client, 'request-service');
    });

    test('Correct numeric header', () => {
        // noinspection JSUnresolvedVariable
        assert.strictEqual(data.headers.Answer, '42');
    });

    ensure();
}
