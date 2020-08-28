"use strict";

const assert = require("assert");
const {init, test, ensure} = require("@popovmp/micro-tester");

const request = require("../index.js");

const url = "https://httpbin.org/post?foo=bar";
const headers  = {};

const data = Buffer.from("foo");

request.post(url, data, headers,
    requestService_post_ready);

// noinspection DuplicatedCode
function requestService_post_ready(err, data) {
    init("Run post-binary.test.js");

    test("No errors", () => {
        assert.ok(!err);
    });

    test("Response received", () => {
        assert.ok(data);
    });

    test("Correct data", () => {
        assert.strictEqual(data.data, "foo");
    });

    ensure();
}
