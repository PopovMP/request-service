'use strict';
'use strict';

const {ok, strictEqual} = require('assert');
const {describe, it} = require('@popovmp/mocha-tiny');

const request = require('../index.js');


request.get(undefined, {}, (err, data, prop)=> {
    describe('Exceptions', () => {
        describe('get(undefined, {}, callback)', ()=>{
            it('Invalid URL: undefined', () => {
                strictEqual(err, 'Invalid URL: undefined');
                ok(!data);
            })
        });
    });
});

request.get('https://example.com', undefined, (err, data, prop)=> {
    describe('Fallback', () => {
        describe('get(url, undefined, callback)', ()=>{
            it('headers: undefined', () => {
                ok(!err);
                ok(data);
            })
        });
    });
});
