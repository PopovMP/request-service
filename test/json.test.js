"use strict";

const assert = require("assert");
const {init, test, ensure} = require("@popovmp/micro-tester");

const request = require("../index.js");

const url = "https://httpbin.org/post?foo=bar";
const headers = {
    "Client": "request-service",
};

const data = {number: 42, text: "foo", list: [1, 1, 2, 3, 5, 8, 12], object: {bar: "baz"}};

request.json(url, data, headers,
    requestService_post_ready);

// noinspection DuplicatedCode
function requestService_post_ready(err, data) {
    init("Run json.test.js");

    test("No errors", () => {
        assert.ok(!err);
    });

    test("Response received", () => {
        assert.ok(data);
    });

    test("Correct query", () => {
        assert.strictEqual(data.args.foo, "bar");
    });

    test("Correct header", () => {
        assert.strictEqual(data.headers.Client, "request-service");
    });

    test("Correct data - number", () => {
        assert.strictEqual(data.json.number, 42);
    });

    test("Correct data - text", () => {
        assert.strictEqual(data.json.text, "foo");
    });

    test("Correct data - list", () => {
        assert.deepStrictEqual(data.json.list, [1, 1, 2, 3, 5, 8, 12]);
    });

    test("Correct data - object", () => {
        assert.deepStrictEqual(data.json.object, {bar: "baz"});
    });

    ensure();
}
