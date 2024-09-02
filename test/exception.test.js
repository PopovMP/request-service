"use strict";

const {ok}   = require("assert");
const {test} = require("node:test");

const request = require("../index.js");
test("Fallback headers", (_ ,done) => {
    request.get("https://example.com", {}, (err, data) => {
        ok(!err);
        ok(data);
        setImmediate(done);
    });
});
