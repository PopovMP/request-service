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
    requestService_post_ready);

// noinspection DuplicatedCode
function requestService_post_ready(err, data) {
    init('Test POST form data');

    test('No errors', () => {
        assert.ok(!err);
    });

    test('Response received', () => {
        assert.ok(data);
    });

    test('Correct query', () => {
        assert.strictEqual(data.args.foo, 'bar');
    });

    test('Correct header', () => {
        assert.strictEqual(data.headers.Client, 'request-service');
    });

    test('Correct data - number (as string)', () => {
        assert.strictEqual(data.form.number, '42');
    });

    test('Correct data - text', () => {
        assert.strictEqual(data.form.text, 'foo');
    });

    test('Correct data - list', () => {
        assert.deepStrictEqual(data.form.list, ['1', '1', '2', '3', '5', '8', '12']);
    });

    ensure();
}
