'use strict';

const assert = require('assert');
const {init, test, ensure} = require('@popovmp/micro-tester');

const request = require('../index.js');

const url = 'https://httpbin.org/post?foo=bar';
const headers = {
    'Client': 'request-service',
};

const data = {number: 42, text: 'foo', list: [1, 1, 2, 3, 5, 8, 12]};

request.form(url, data, headers,
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
    init('Test POST form data');

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

    test('Correct header', () => {
        // noinspection JSUnresolvedVariable
        assert.strictEqual(data.headers.Client, 'request-service');
    });

    test('Correct data - number (as string)', () => {
        // noinspection JSUnresolvedVariable
        assert.strictEqual(data.form.number, '42');
    });

    test('Correct data - text', () => {
        // noinspection JSUnresolvedVariable
        assert.strictEqual(data.form.text, 'foo');
    });

    test('Correct data - list', () => {
        // noinspection JSUnresolvedVariable
        assert.deepStrictEqual(data.form.list, ['1', '1', '2', '3', '5', '8', '12']);
    });

    ensure();
}
