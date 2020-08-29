'use strict';

const assert = require('assert');
const {init, test, ensure} = require('@popovmp/micro-tester');

const request = require('../index.js');

const url     = 'https://httpbin.org/post?foo=bar';
const data    = {'pi': 3.14};
const headers = {
    'Client': 'request-service',
    'Answer': 42,
};


request.post(url, data, headers,
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
    init('Test POST generic data');

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

    test('Correct data', () => {
        // noinspection JSUnresolvedVariable
        assert.strictEqual(data.json.pi, 3.14);
    });

    ensure();
}
