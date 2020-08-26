"use strict";

const assert = require("assert");
const {init, test, ensure} = require("@popovmp/micro-tester");

const requestService = require("../index.js");

const url = "https://httpbin.org/get?foo=bar";
const headers  = {
    "Client": "request-service",
    "Answer": 42,
};

requestService.get(url, headers,
    requestService_get_ready);

// noinspection DuplicatedCode
function requestService_get_ready(err, data, status) {
    init("Run get.test.js");

    test("No errors", () => {
        assert.ok(!err);
    });

    test("Response received", () => {
        assert.ok(data);
    });

    const res = JSON.parse(data);

    test("Correct query", () => {
        assert.strictEqual(res.args.foo, "bar");
    });

    test("Correct string header", () => {
        assert.strictEqual(res.headers.Client, "request-service");
    });

    test("Correct numeric header", () => {
        assert.strictEqual(res.headers.Answer, "42");
    });

    test("Status 200", () => {
        assert.strictEqual(status, 200);
    });

    ensure();
}
