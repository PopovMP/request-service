'use strict';

const assert = require('assert');
const {init, test, ensure} = require('@popovmp/micro-tester');

const request = require('../index.js');

const url = 'https://httpbin.org';
const headers = {};

request.head(url, headers,
    requestService_head_ready);

// noinspection DuplicatedCode
function requestService_head_ready(err, data) {
    init('Test HEAD request');

    test('No errors', () => {
        assert.ok(!err);
    });

    test('There is no data', () => {
        assert.strictEqual(data, '');
    });

    ensure();
}
