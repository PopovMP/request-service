'use strict';

const {ok, strictEqual} = require('assert');
const {describe, it} = require('@popovmp/mocha-tiny');

const request = require('../index.js');

request.get(undefined, {}, (err, data)=> {
    describe('Exceptions', () => {
        describe('get(undefined, {}, callback)', ()=>{
            it('Invalid URL', () => {
                strictEqual(err, 'Invalid URL');
                ok(!data);
            })
        });
    });
});

request.get('https://example.com', undefined, (err, data)=> {
    describe('Fallback', () => {
        describe('get(url, undefined, callback)', ()=>{
            it('headers: undefined', () => {
                ok(!err);
                ok(data);
            })
        });
    });
});
