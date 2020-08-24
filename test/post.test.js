"use strict";

const qs = require("querystring");
const assert = require("assert");
const {init, test, ensure} = require("@popovmp/micro-tester");

const requestService = require("../index.js");

init("Run post.test.js");

test("Test `post`", () => {
    const hostname = "httpbin.org";
    const path     = "/post?" + qs.stringify({"foo": "bar"});
    const headers  = {
        "Client": "request-service",
        "Answer": 42,
    };

    const data = {"pi": 3.14};

    requestService.post(hostname, path, data, headers,
        requestService_post_ready);
});

// noinspection DuplicatedCode
function requestService_post_ready(err, data, status) {
    if (err) {
        console.error("Error: " + err);
    }

    test("Response received", () => {
        assert.ok(data);
    });

    const res = JSON.parse(data);

    test("Correct res.args.foo", () => {
        assert.strictEqual(res.args.foo, "bar");
    });

    test("Correct string header", () => {
        assert.strictEqual(res.headers.Client, "request-service");
    });

    test("Correct numeric header", () => {
        assert.strictEqual(res.headers.Answer, "42");
    });

    test("Correct data", () => {
        assert.strictEqual(res.json.pi, 3.14);
    });

    test("Status 200", () => {
        assert.strictEqual(status, 200);
    });

    ensure();
}
