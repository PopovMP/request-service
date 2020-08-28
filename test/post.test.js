"use strict";

const assert = require("assert");
const {init, test, ensure} = require("@popovmp/micro-tester");

const request = require("../index.js");

const url = "https://httpbin.org/post?foo=bar";
const headers  = {
    "Client": "request-service",
    "Answer": 42,
};

const data = {"pi": 3.14};

request.post(url, data, headers,
    requestService_post_ready);

// noinspection DuplicatedCode
function requestService_post_ready(err, data) {
    init("Run post.test.js");

    test("No errors", () => {
        assert.ok(!err);
    });

    test("Response received", () => {
        assert.ok(data);
    });

    test("Correct query", () => {
        assert.strictEqual(data.args.foo, "bar");
    });

    test("Correct string header", () => {
        assert.strictEqual(data.headers.Client, "request-service");
    });

    test("Correct numeric header", () => {
        assert.strictEqual(data.headers.Answer, "42");
    });

    test("Correct data", () => {
        assert.strictEqual(data.json.pi, 3.14);
    });

    ensure();
}
