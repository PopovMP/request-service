'use strict';

const {ok, strictEqual, deepStrictEqual} = require('assert');
const {describe, it} = require('@popovmp/mocha-tiny');

const request = require('../index.js');

const url     = 'https://httpbin.org/post?foo=bar';
const form    = {number: 42, text: 'foo', list: [1, 1, 2, 3, 5, 8, 12]};
const headers = {Client: 'request-service'};

request.form(url, form, headers,
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
    describe('Test POST form data', () => {

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

        it('Correct query', () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.args.foo, 'bar');
        });

        it('Correct header', () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.headers.Client, 'request-service');
        });

        it('Correct data - number (as string)', () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.form.number, '42');
        });

        it('Correct data - text', () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.form.text, 'foo');
        });

        it('Correct data - list', () => {
            // noinspection JSUnresolvedVariable
            deepStrictEqual(data.form.list, ['1', '1', '2', '3', '5', '8', '12']);
        });
    });
}
