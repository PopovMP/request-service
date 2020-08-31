'use strict';

const {ok, strictEqual, deepStrictEqual} = require('assert');
const {describe, it} = require('@popovmp/mocha-tiny');

const request = require('../index.js');

const url     = 'https://httpbin.org/post?foo=bar';
const json    = {number: 42, text: 'foo', list: [1, 1, 2, 3, 5, 8, 12], object: {bar: 'baz'}};
const headers = {'Client': 'request-service',};

request.json(url, json, headers,
    request_json_ready);

// noinspection DuplicatedCode
/**
 * @type { ResponseCallback }
 *
 * @param { null | string } err
 * @param { Buffer | Object | string | null } data
 * @param { RequestProperties } [prop]
 */
function request_json_ready(err, data, prop) {
    describe('Test POST json data', () => {

        describe('json(url, json, headers, callback)', () => {
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

            it('Correct query', () => {
                // noinspection JSUnresolvedVariable
                strictEqual(data.args.foo, 'bar');
            });

            it('Correct header', () => {
                // noinspection JSUnresolvedVariable
                strictEqual(data.headers.Client, 'request-service');
            });

            it('Correct data - number', () => {
                // noinspection JSUnresolvedVariable
                strictEqual(data.json.number, 42);
            });

            it('Correct data - text', () => {
                // noinspection JSUnresolvedVariable
                strictEqual(data.json.text, 'foo');
            });

            it('Correct data - list', () => {
                // noinspection JSUnresolvedVariable
                deepStrictEqual(data.json.list, [1, 1, 2, 3, 5, 8, 12]);
            });

            it('Correct data - object', () => {
                // noinspection JSUnresolvedVariable
                deepStrictEqual(data.json.object, {bar: 'baz'});
            });
        });
    });
}
