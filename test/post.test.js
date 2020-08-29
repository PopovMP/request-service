'use strict';

const {ok, strictEqual} = require('assert');
const {describe, it} = require('@popovmp/mocha-tiny');

const request = require('../index.js');

const url     = 'https://httpbin.org/post?foo=bar';
const data    = {'pi': 3.14};
const headers = {'Client': 'request-service', 'Answer': 42};


request.post(url, data, headers,
    request_post_ready);

/**
 * @type { ResponseCallback }
 *
 * @param { null | string } err
 * @param { Buffer | Object | string | null } data
 * @param { RequestProperties } [prop]
 */
function request_post_ready(err, data, prop) {
    describe('Test POST generic data', () => {

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
    
        it('Correct string header', () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.headers.Client, 'request-service');
        });
    
        it('Correct numeric header', () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.headers.Answer, '42');
        });
    
        it('Correct data', () => {
            // noinspection JSUnresolvedVariable
            strictEqual(data.json.pi, 3.14);
        });
    });
}
